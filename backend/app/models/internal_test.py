# app/models/internal_test.py
from sqlalchemy import Column, Integer, String, Float, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from app.db.database import Base

class InternalTest(Base):
    __tablename__ = "internal_tests"
    __table_args__ = (
        UniqueConstraint("student_id", "subject_code", "test_number", "semester", name="uq_internal"),
    )

    id           = Column(Integer, primary_key=True, index=True)
    student_id   = Column(String(20), index=True, nullable=False)
    student_name = Column(String(100))
    year         = Column(String(20), nullable=True)               # kept for historical snapshot
    batch        = Column(String(9),  nullable=True, index=True)   # "2023-2027"
    department   = Column(String(50), nullable=True)               # "IT"
    section      = Column(String(5),  nullable=False)
    semester     = Column(Integer, nullable=False, default=1)      # 1-8 based on year
    subject_code = Column(String(20), nullable=False)
    subject_name = Column(String(100))
    test_number  = Column(Integer, nullable=False)   # 1, 2, 3
    max_marks    = Column(Float, default=50)
    marks_scored = Column(Float, default=0)
    upload_batch = Column(String(50), nullable=True)               # batch id for rollback
    uploaded_at  = Column(DateTime(timezone=True), server_default=func.now())
