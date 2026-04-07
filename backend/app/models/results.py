# app/models/results.py
from sqlalchemy import Column, Integer, String, Float, DateTime, UniqueConstraint, Boolean
from sqlalchemy.sql import func
from app.db.database import Base

class Result(Base):
    """One row = one student's result for one subject in one semester."""
    __tablename__ = "results"
    __table_args__ = (
        UniqueConstraint("student_id", "subject_code", "semester", name="uq_result"),
    )

    id           = Column(Integer, primary_key=True, index=True)
    student_id   = Column(String(20), index=True, nullable=False)
    student_name = Column(String(100))
    year         = Column(String(20), nullable=False)
    department   = Column(String(50), nullable=True)               # "IT"
    section      = Column(String(5),  nullable=False)
    semester     = Column(Integer, nullable=False)
    subject_code = Column(String(20), nullable=False, index=True)
    subject_name = Column(String(100))
    internal_marks = Column(Float, default=0)
    external_marks = Column(Float, default=0)
    total_marks    = Column(Float, default=0)
    grade          = Column(String(5))
    is_pass        = Column(Boolean, default=True)
    has_arrear     = Column(Boolean, default=False)
    uploaded_at    = Column(DateTime(timezone=True), server_default=func.now())
    upload_batch   = Column(String(50))
