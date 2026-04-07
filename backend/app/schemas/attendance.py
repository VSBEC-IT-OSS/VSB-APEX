# app/schemas/attendance.py
from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class AttendanceOverview(BaseModel):
    overall: float
    totalStudents: int
    excessLeave: int          # students with >4 absent days (replaces belowThreshold)
    trend: List[dict]

class SectionAttendance(BaseModel):
    year: str
    section: str
    students: int
    avg: float
    excessLeave: int          # replaces below75

class AttendanceUploadResponse(BaseModel):
    success: bool
    rows_inserted: int
    rows_skipped: int
    batch_id: str
    message: str
