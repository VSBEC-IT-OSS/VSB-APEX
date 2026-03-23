from pydantic import BaseModel
from typing import List

class ResultsOverview(BaseModel):
    overallPassPct: float
    totalStudents: int
    failCount: int
    avgCGPA: float
    trend: List[dict]

class SubjectResult(BaseModel):
    subject: str
    code: str
    passP: float
    avgMarks: float
    arrears: int

class SectionResult(BaseModel):
    year: str
    section: str
    passP: float
    avgCGPA: float
    arrears: int

class ResultUploadResponse(BaseModel):
    success: bool
    rows_inserted: int
    rows_skipped: int
    batch_id: str
    message: str
