"""
User model — updated to include last_login timestamp.
Drop-in replacement for backend/app/models/user.py
"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(100), nullable=False)
    email       = Column(String(150), unique=True, index=True, nullable=False)
    password    = Column(String(255), nullable=False)
    role        = Column(String(20), default="staff")   # admin | hod | staff
    is_active   = Column(Boolean, default=True)
    last_login  = Column(DateTime(timezone=True), nullable=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
