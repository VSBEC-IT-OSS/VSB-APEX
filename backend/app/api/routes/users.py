# app/api/routes/users.py
"""
User Management routes (Admin only unless noted):
  GET    /api/users                          — list all users
  POST   /api/users                          — create user
  PATCH  /api/users/{id}                     — update user (name, email, role, dept, password, active)
  DELETE /api/users/{id}                     — delete user
  GET    /api/users/activity-log             — activity log (admin sees all, hod sees own dept)
  GET    /api/users/dept-change-requests     — pending dept change requests (admin)
  POST   /api/users/dept-change-requests/{id}/approve
  POST   /api/users/dept-change-requests/{id}/reject
  GET    /api/users/upload-history           — own recent upload batches
"""
from typing import List, Optional

from fastapi import APIRouter, Depends, Request, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_admin, require_admin_or_hod, get_db
from app.models.user import User
from app.models.activity_log import ActivityLog
from app.schemas.user import UserCreate, UserUpdate, UserOut, ActivityLogOut
from app.services import user_service

router = APIRouter(prefix="/users", tags=["users"])


# ── Activity Log ──────────────────────────────────────────────────────────────

@router.get("/activity-log", response_model=List[ActivityLogOut])
def get_activity_log(
    limit: int = Query(200, ge=1, le=1000),
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_hod),
):
    """
    Admins see all logs.
    HODs see only logs of users in their department.
    """
    logs = user_service.get_activity_log(db, limit=limit, user_id=user_id)
    if current_user.role == "hod" and current_user.department:
        # Filter to users in HOD's dept
        dept_user_ids = {
            u.id for u in db.query(User.id).filter_by(department=current_user.department).all()
        }
        logs = [l for l in logs if l.user_id in dept_user_ids]
    return logs


# ── CRUD ──────────────────────────────────────────────────────────────────────

@router.get("", response_model=List[UserOut])
def list_users(
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return user_service.list_users(db)


@router.post("", response_model=UserOut, status_code=201)
def create_user(
    data: UserCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return user_service.create_user(db, data)


@router.patch("/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    data: UserUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    return user_service.update_user(db, user_id, data)


@router.delete("/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin),
):
    user_service.delete_user(db, user_id, requesting_user_id=current_user.id)


# ── Dept Change Requests ──────────────────────────────────────────────────────

@router.get("/dept-change-requests")
def list_dept_change_requests(
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """Return pending department change requests from the activity log."""
    logs = (
        db.query(ActivityLog, User.name, User.email, User.department)
        .join(User, ActivityLog.user_id == User.id)
        .filter(ActivityLog.action.like("dept_change_request:%"))
        .order_by(ActivityLog.created_at.desc())
        .limit(200)
        .all()
    )
    results = []
    for log, uname, uemail, current_dept in logs:
        requested_dept = log.action.split("dept_change_request:", 1)[-1]
        results.append({
            "log_id":           log.id,
            "user_id":          log.user_id,
            "user_name":        uname,
            "user_email":       uemail,
            "current_dept":     current_dept,
            "requested_dept":   requested_dept,
            "requested_at":     log.created_at,
        })
    return results


@router.post("/dept-change-requests/{log_id}/approve")
def approve_dept_change(
    log_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    log = db.query(ActivityLog).filter_by(id=log_id).first()
    if not log or not log.action.startswith("dept_change_request:"):
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Request not found")
    requested_dept = log.action.split("dept_change_request:", 1)[-1]
    user = db.query(User).filter_by(id=log.user_id).first()
    if user:
        user.department = requested_dept
        db.commit()
    # Mark as resolved in log
    log.action = f"dept_change_approved:{requested_dept}"
    db.commit()
    return {"detail": f"Department changed to {requested_dept} for user {log.user_id}"}


@router.post("/dept-change-requests/{log_id}/reject")
def reject_dept_change(
    log_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    log = db.query(ActivityLog).filter_by(id=log_id).first()
    if not log or not log.action.startswith("dept_change_request:"):
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Request not found")
    log.action = log.action.replace("dept_change_request:", "dept_change_rejected:")
    db.commit()
    return {"detail": "Department change request rejected"}


# ── Upload History (self) ─────────────────────────────────────────────────────

@router.get("/upload-history")
def upload_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Returns the last 10 upload actions by the current user from the activity log."""
    logs = (
        db.query(ActivityLog)
        .filter(
            ActivityLog.user_id == current_user.id,
            ActivityLog.action.like("upload%"),
        )
        .order_by(ActivityLog.created_at.desc())
        .limit(10)
        .all()
    )
    return [{"action": l.action, "uploaded_at": l.created_at} for l in logs]
