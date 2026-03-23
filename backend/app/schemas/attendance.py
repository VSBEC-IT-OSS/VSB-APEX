from pydantic import BaseModel
from typing import Optional, List
from datetime import date

class AttendanceOverview(BaseModel):
    overall: float
    totalStudents: int
    belowThreshold: int
    aboveThreshold: int
    trend: List[dict]

class SectionAttendance(BaseModel):
    year: str
    section: str
    students: int
    avg: float
    below75: int

class AttendanceUploadResponse(BaseModel):
    success: bool
    rows_inserted: int
    rows_skipped: int
    batch_id: str
    message: str
