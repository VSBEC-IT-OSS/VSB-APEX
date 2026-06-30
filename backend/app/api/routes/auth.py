# app/api/routes/auth.py
"""
Auth routes:
  POST /api/auth/login
  POST /api/auth/logout
  GET  /api/auth/me
  PATCH /api/auth/me               — self profile update (name, email, username, password)
  POST /api/auth/forgot-password   — sends reset link via Gmail SMTP
  POST /api/auth/reset-password    — consumes token, sets new password
  POST /api/auth/change-password   — requires current password, sets new one
  POST /api/auth/request-dept-change
"""
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from typing import Optional

from app.api.deps import get_current_user, get_db
from app.core.security import (
    verify_password, create_access_token, hash_password, decode_token
)
from app.models.user import User
from app.models.password_reset import PasswordResetToken
from app.schemas.user import LoginRequest, Token, UserOut
from app.services.user_service import record_activity, touch_last_login

router = APIRouter(prefix="/auth", tags=["auth"])


# ── Schemas (local, small) ────────────────────────────────────────────────────

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    email: Optional[EmailStr] = None

class DeptChangeRequest(BaseModel):
    requested_department: str
    reason: Optional[str] = None


# ── Login / Logout / Me ───────────────────────────────────────────────────────

@router.post("/login", response_model=Token)
def login(body: LoginRequest, request: Request, db: Session = Depends(get_db)):
    user: User | None = db.query(User).filter_by(email=body.email).first()
    if not user or not verify_password(body.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is deactivated")

    token = create_access_token({"sub": str(user.id), "role": user.role})
    record_activity(db, user.id, "login", request)
    touch_last_login(db, user.id)

    return Token(
        access_token=token,
        token_type="bearer",
        user=UserOut.model_validate(user),
    )


@router.post("/logout")
def logout(request: Request, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    record_activity(db, current_user.id, "logout", request)
    return {"detail": "Logged out"}


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user


# ── Self Profile Update ───────────────────────────────────────────────────────

@router.patch("/me", response_model=UserOut)
def update_me(
    data: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if data.name is not None:
        current_user.name = data.name.strip()
    if data.username is not None:
        conflict = db.query(User).filter(
            User.username == data.username.strip(),
            User.id != current_user.id
        ).first()
        if conflict:
            raise HTTPException(status_code=409, detail="Username already taken")
        current_user.username = data.username.strip()
    if data.email is not None:
        conflict = db.query(User).filter(
            User.email == data.email,
            User.id != current_user.id
        ).first()
        if conflict:
            raise HTTPException(status_code=409, detail="Email already in use")
        current_user.email = data.email
    db.commit()
    db.refresh(current_user)
    record_activity(db, current_user.id, "profile_update", None)
    return current_user


# ── Change Password (self, requires old password) ─────────────────────────────

@router.post("/change-password")
def change_password(
    data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not verify_password(data.current_password, current_user.password):
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    if len(data.new_password) < 8:
        raise HTTPException(status_code=422, detail="Password must be at least 8 characters")
    current_user.password = hash_password(data.new_password)
    db.commit()
    record_activity(db, current_user.id, "password_change", None)
    return {"detail": "Password updated successfully"}


# ── Forgot Password ───────────────────────────────────────────────────────────

@router.post("/forgot-password")
def forgot_password(body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Sends a reset link. Always returns 200 to avoid user enumeration."""
    user = db.query(User).filter_by(email=body.email).first()
    if not user:
        # Return generic success even if email not found (security best practice)
        return {"detail": "If this email is registered, you will receive a reset link."}

    # Invalidate any existing tokens for this user
    db.query(PasswordResetToken).filter_by(user_id=user.id, is_used=False).delete()

    # Create a short-lived JWT purely as the token string
    raw_token = create_access_token(
        {"sub": str(user.id), "type": "pwd_reset"},
        expires_delta=timedelta(minutes=15)
    )
    reset_token = PasswordResetToken(
        user_id=user.id,
        token=raw_token,
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=15),
    )
    db.add(reset_token)
    db.commit()

    # Send email (best-effort — don't fail the request if SMTP is unconfigured)
    try:
        from app.utils.email import send_password_reset_email
        send_password_reset_email(user.email, user.name, raw_token)
    except Exception:
        pass  # Silently skip in dev if mail not configured

    return {"detail": "If this email is registered, you will receive a reset link."}


@router.post("/reset-password")
def reset_password(body: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Consume a reset token and set a new password."""
    record = db.query(PasswordResetToken).filter_by(token=body.token, is_used=False).first()
    if not record:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    now = datetime.now(timezone.utc)
    expires = record.expires_at
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    if now > expires:
        raise HTTPException(status_code=400, detail="Reset token has expired")

    if len(body.new_password) < 8:
        raise HTTPException(status_code=422, detail="Password must be at least 8 characters")

    user = db.query(User).filter_by(id=record.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.password  = hash_password(body.new_password)
    record.is_used = True
    db.commit()
    record_activity(db, user.id, "password_reset", None)
    return {"detail": "Password reset successful. You can now log in."}


# ── Department Change Request ─────────────────────────────────────────────────

@router.post("/request-dept-change")
def request_dept_change(
    data: DeptChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Log a department change request — admin will see it in the admin panel."""
    action_str = f"dept_change_request:{data.requested_department}"
    record_activity(db, current_user.id, action_str, None)

    # Notify the super admin via email (best-effort)
    try:
        from app.utils.email import send_dept_change_notification_to_admin
        admin = db.query(User).filter_by(role="admin", is_active=True).first()
        if admin:
            send_dept_change_notification_to_admin(
                admin.email, current_user.name, data.requested_department
            )
    except Exception:
        pass

    return {"detail": "Your department change request has been submitted for admin review."}
