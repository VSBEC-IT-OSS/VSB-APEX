# app/schemas/user.py
"""
Schemas for user management, activity log, and related entities.
"""
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import datetime


# ── Auth ──────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"


# ── Users ─────────────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "staff"
    department: Optional[str] = None

    @field_validator("role")
    @classmethod
    def role_valid(cls, v: str) -> str:
        if v not in ("admin", "hod", "staff"):
            raise ValueError("role must be admin, hod or staff")
        return v


class UserUpdate(BaseModel):
    name:       Optional[str]   = None
    username:   Optional[str]   = None
    email:      Optional[EmailStr] = None
    role:       Optional[str]   = None
    department: Optional[str]   = None
    is_active:  Optional[bool]  = None
    password:   Optional[str]   = None  # admin force-reset

    @field_validator("role")
    @classmethod
    def role_valid(cls, v):
        if v is not None and v not in ("admin", "hod", "staff"):
            raise ValueError("role must be admin, hod or staff")
        return v


class UserOut(BaseModel):
    id:         int
    name:       str
    username:   Optional[str]      = None
    email:      str
    role:       str
    department: Optional[str]      = None
    is_active:  bool
    last_login: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ── Activity Log ──────────────────────────────────────────────────────────────

class ActivityLogOut(BaseModel):
    id:         int
    user_id:    int
    user_name:  Optional[str] = None
    user_email: Optional[str] = None
    action:     str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
