"""
User Management routes
  GET    /api/users                — list all users (admin only)
  POST   /api/users                — create user (admin only)
  PATCH  /api/users/{id}           — update user (admin only)
  DELETE /api/users/{id}           — delete user (admin only)
  GET    /api/users/activity-log   — activity log (admin only)
"""
from typing import List, Optional

from fastapi import APIRouter, Depends, Request, Query
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_admin, get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserOut, ActivityLogOut
from app.services import user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/activity-log", response_model=List[ActivityLogOut])
def get_activity_log(
    limit: int = Query(200, ge=1, le=1000),
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """Return login/logout activity (newest first). Filter by user_id optionally."""
    return user_service.get_activity_log(db, limit=limit, user_id=user_id)


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
