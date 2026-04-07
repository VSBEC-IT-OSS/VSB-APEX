# app/models/attendance.py
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, ForeignKey, UniqueConstraint, Boolean
from sqlalchemy.sql import func
from app.db.database import Base

class AttendanceRecord(Base):
    """
    One row = one student's attendance for one subject on one date.
    Sourced from: Excel upload or biometric CSV.
    """
    __tablename__ = "attendance_records"
    __table_args__ = (
        UniqueConstraint("student_id", "subject_code", "date", name="uq_attendance"),
    )

    id           = Column(Integer, primary_key=True, index=True)
    student_id   = Column(String(20), index=True, nullable=False)   # reg number
    student_name = Column(String(100))
    year         = Column(String(20), nullable=False)               # "I Year"
    department   = Column(String(50), nullable=True)               # "IT"
    section      = Column(String(5),  nullable=False)               # "A"
    subject_code = Column(String(20), nullable=True)
    subject_name = Column(String(100), nullable=True)
    date         = Column(Date, nullable=False, index=True)
    status       = Column(String(10), nullable=False)               # present | absent
    uploaded_at  = Column(DateTime(timezone=True), server_default=func.now())
    upload_batch = Column(String(50))                               # batch id for rollback


class AttendanceSummary(Base):
    """
    Pre-aggregated summary per student per subject.
    Recomputed after every upload. Used by dashboard APIs.
    """
    __tablename__ = "attendance_summary"
    __table_args__ = (
        UniqueConstraint("student_id", "subject_code", name="uq_att_summary"),
    )

    id              = Column(Integer, primary_key=True, index=True)
    student_id      = Column(String(20), index=True, nullable=False)
    student_name    = Column(String(100))
    year            = Column(String(20), nullable=False)
    department      = Column(String(50), nullable=True)
    section         = Column(String(5),  nullable=False)
    subject_code    = Column(String(20), nullable=True)
    subject_name    = Column(String(100), nullable=True)
    total_classes   = Column(Integer, default=0)
    classes_attended= Column(Integer, default=0)
    attendance_pct  = Column(Float, default=0.0)
    is_excess_leave     = Column(Boolean, default=False)
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

from sqlalchemy import Boolean
