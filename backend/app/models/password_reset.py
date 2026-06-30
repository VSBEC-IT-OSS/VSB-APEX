# app/models/password_reset.py
"""
PasswordResetToken — stores one-time JWT-backed tokens for forgot-password flow.
Tokens expire in 15 minutes. Consumed on use.
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.db.database import Base


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token      = Column(String(255), nullable=False, unique=True, index=True)
    is_used    = Column(Boolean, default=False)
    expires_at = Column(DateTime(timezone=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
