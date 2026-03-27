# app/api/routes/results.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.db.database import get_db
from app.api.deps import get_current_user
from app.services import results_service as svc

router = APIRouter(prefix="/results", tags=["Results"])

@router.get("/overview")
def overview(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return svc.get_overview(db)

@router.get("/subject-analysis")
def subject_analysis(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return svc.get_subject_analysis(db)

@router.get("/section")
def section_results(
    year: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    data = svc.get_section_results(db)
    if year:
        data = [d for d in data if d["year"] == year]
    return data
