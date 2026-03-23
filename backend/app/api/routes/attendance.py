from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.db.database import get_db
from app.api.deps import get_current_user
from app.services import attendance_service as svc

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.get("/overview")
def overview(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return svc.get_overview(db)

@router.get("/section")
def sections(
    year: Optional[str] = Query(None, description="Filter by year e.g. 'I Year'"),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    data = svc.get_sections(db)
    if year:
        data = [d for d in data if d["year"] == year]
    return data

@router.get("/student/{student_id}")
def student(student_id: str, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return svc.get_student(db, student_id)
