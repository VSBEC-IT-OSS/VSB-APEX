# app/models/student.py
"""
Canonical Student registry.
- reg_number is the unique identifier (e.g. "20IT001")
- batch is the admission year (e.g. "2023") — used to dynamically compute
  current year of study: current_year = (current_academic_year - int(batch_start)) + 1
"""
from sqlalchemy import Column, Integer, String, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from app.db.database import Base


class Student(Base):
    __tablename__ = "students"
    __table_args__ = (
        UniqueConstraint("reg_number", name="uq_student_reg"),
    )

    id           = Column(Integer, primary_key=True, index=True)
    reg_number   = Column(String(20), nullable=False, index=True)   # "20IT001"
    name         = Column(String(100), nullable=False)
    email        = Column(String(150), nullable=True)               # optional student email
    department   = Column(String(50), nullable=False)               # "IT", "CSE" etc.
    section      = Column(String(5),  nullable=True)                # "A", "B"
    batch        = Column(String(9),  nullable=False, index=True)   # "2023-2027"
    is_active    = Column(Integer, default=1)                       # 1=active, 0=alumnus
    created_at   = Column(DateTime(timezone=True), server_default=func.now())
    updated_at   = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
