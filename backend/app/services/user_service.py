# app/services/user_service.py
"""
Service layer for user management and activity logging.
"""
from datetime import datetime, timezone
from typing import Optional, List

from fastapi import HTTPException, Request
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.activity_log import ActivityLog
from app.schemas.user import UserCreate, UserUpdate, ActivityLogOut
from app.core.security import hash_password


# ── Helpers ───────────────────────────────────────────────────────────────────

def _get_client_ip(request: Optional[Request]) -> Optional[str]:
    if request is None:
        return None
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else None


def _get_user_agent(request: Optional[Request]) -> Optional[str]:
    if request is None:
        return None
    ua = request.headers.get("user-agent", "")
    return ua[:300] if ua else None


# ── Activity Log ──────────────────────────────────────────────────────────────

def record_activity(
    db: Session,
    user_id: int,
    action: str,
    request: Optional[Request] = None,
) -> ActivityLog:
    log = ActivityLog(
        user_id=user_id,
        action=action,
        ip_address=_get_client_ip(request),
        user_agent=_get_user_agent(request),
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


def get_activity_log(
    db: Session,
    limit: int = 200,
    user_id: Optional[int] = None,
) -> List[ActivityLogOut]:
    q = (
        db.query(ActivityLog, User.name, User.email)
        .join(User, ActivityLog.user_id == User.id, isouter=True)
        .order_by(ActivityLog.created_at.desc())
    )
    if user_id:
        q = q.filter(ActivityLog.user_id == user_id)
    rows = q.limit(limit).all()

    result = []
    for log, uname, uemail in rows:
        result.append(
            ActivityLogOut(
                id=log.id,
                user_id=log.user_id,
                user_name=uname,
                user_email=uemail,
                action=log.action,
                ip_address=log.ip_address,
                user_agent=log.user_agent,
                created_at=log.created_at,
            )
        )
    return result


# ── Users CRUD ────────────────────────────────────────────────────────────────

def list_users(db: Session) -> List[User]:
    return db.query(User).order_by(User.created_at.desc()).all()


def get_user(db: Session, user_id: int) -> User:
    user = db.query(User).filter_by(id=user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def create_user(db: Session, data: UserCreate) -> User:
    if db.query(User).filter_by(email=data.email).first():
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(
        name=data.name,
        email=data.email,
        password=hash_password(data.password),
        role=data.role,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user_id: int, data: UserUpdate) -> User:
    user = get_user(db, user_id)
    if data.name is not None:
        user.name = data.name
    if data.role is not None:
        user.role = data.role
    if data.is_active is not None:
        user.is_active = data.is_active
    if data.password is not None:
        user.password = hash_password(data.password)
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user_id: int, requesting_user_id: int) -> None:
    if user_id == requesting_user_id:
        raise HTTPException(status_code=400, detail="Cannot delete your own account")
    user = get_user(db, user_id)
    db.delete(user)
    db.commit()


def touch_last_login(db: Session, user_id: int) -> None:
    user = db.query(User).filter_by(id=user_id).first()
    if user:
        user.last_login = datetime.now(timezone.utc)
        db.commit()
