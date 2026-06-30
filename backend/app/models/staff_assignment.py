# app/models/staff_assignment.py
"""
StaffAssignment — maps a staff user to a specific department/batch/section.
HODs create these assignments to grant staff upload permissions.
Admins can also manage them.
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.database import Base


class StaffAssignment(Base):
    __tablename__ = "staff_assignments"
    __table_args__ = (
        UniqueConstraint("user_id", "department", "batch", "section", name="uq_staff_assignment"),
    )

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    department  = Column(String(50), nullable=False)    # "IT", "CSE"
    batch       = Column(String(9),  nullable=False)    # "2023-2027"
    section     = Column(String(5),  nullable=True)     # "A", "B" or NULL = all sections
    created_by  = Column(Integer, ForeignKey("users.id"), nullable=True)  # HOD who created
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    user        = relationship("User", foreign_keys=[user_id], backref="assignments")
