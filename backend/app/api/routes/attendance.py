# app/api/routes/attendance.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date
from app.db.database import get_db
from app.db.database_bio import get_bio_db
from app.api.deps import get_current_user
from app.services import attendance_service as svc

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.get("/overview")
def overview(
    department: Optional[str] = Query(None),
    year:       Optional[str] = Query(None),
    date_from:  Optional[date] = Query(None, alias="from"),
    date_to:    Optional[date] = Query(None, alias="to"),
    db: Session = Depends(get_db),
    db_bio: Session = Depends(get_bio_db),
    _=Depends(get_current_user),
):
    return svc.get_overview(db, db_bio, department=department, year=year,
                            date_from=date_from, date_to=date_to)

@router.get("/section")
def sections(
    department: Optional[str] = Query(None),
    year:       Optional[str] = Query(None),
    section:    Optional[str] = Query(None),
    date_from:  Optional[date] = Query(None, alias="from"),
    date_to:    Optional[date] = Query(None, alias="to"),
    db: Session = Depends(get_db),
    db_bio: Session = Depends(get_bio_db),
    _=Depends(get_current_user),
):
    return svc.get_sections(db, db_bio, department=department, year=year,
                            section=section, date_from=date_from, date_to=date_to)

@router.get("/student/{student_id}")
def student(student_id: str, db: Session = Depends(get_db),
            db_bio: Session = Depends(get_bio_db),
            _=Depends(get_current_user)):
    return svc.get_student(db, db_bio, student_id)

@router.get("/available-dates")
def available_dates(
    db: Session = Depends(get_db),
    db_bio: Session = Depends(get_bio_db),
    _=Depends(get_current_user),
):
    return svc.get_available_dates(db, db_bio)
