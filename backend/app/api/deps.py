# app/api/deps.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.core.security import decode_token
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    user = db.query(User).filter_by(id=int(payload["sub"])).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or inactive")
    return user


def require_role(allowed_roles: List[str]):
    """Factory: returns a FastAPI dependency that enforces role membership."""
    def _dep(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail=f"Access denied. Required role(s): {', '.join(allowed_roles)}"
            )
        return current_user
    return _dep


# Convenience shorthands
require_admin        = require_role(["admin"])
require_admin_or_hod = require_role(["admin", "hod"])
require_staff        = require_role(["admin", "hod", "staff"])  # authenticated any role
