# backend/app/api/routes/results.py
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from app.db.database import get_db
from app.api.deps import get_current_user
from app.services import results_service as svc

router = APIRouter(prefix="/results", tags=["Results"])

@router.get("/overview")
def overview(db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Get overall results summary across all semesters"""
    return svc.get_overview(db)

@router.get("/subject-analysis")
def subject_analysis(db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Get subject-wise pass %, arrears, and average marks"""
    return svc.get_subject_analysis(db)

@router.get("/section")
def section_results(
    year: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Get section-wise results summary"""
    data = svc.get_section_results(db)
    if year:
        data = [d for d in data if d["year"] == year]
    return data

@router.get("/by-semester")
def results_by_semester(
    semester: Optional[int] = Query(None),
    section: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
) -> List[dict]:
    """Get all result records, optionally filtered by semester and section"""
    return svc.get_results_by_semester(db, semester, section)

@router.get("/semester/{semester}/section/{section}")
def semester_section_analysis(
    semester: int,
    section: str,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Get detailed analysis for a specific semester and section"""
    if semester < 1 or semester > 8:
        raise HTTPException(400, "Semester must be between 1 and 8")
    return svc.get_semester_section_analysis(db, semester, section)

@router.get("/student/{student_id}")
def student_results(
    student_id: str,
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Get all results for a specific student across all semesters"""
    results = svc.get_student_results(db, student_id)
    if not results:
        raise HTTPException(404, f"No results found for student {student_id}")
    return results

@router.get("/comparison/semesters")
def semester_comparison(
    section: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Get pass % trend across semesters for a section"""
    return svc.get_semester_trend(db, section)

@router.get("/comparison/sections")
def section_comparison(
    semester: int = Query(...),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Get pass % comparison across all sections for a specific semester"""
    return svc.get_section_comparison(db, semester)

@router.get("/stats/subject")
def subject_stats(
    semester: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Get statistics for each subject"""
    return svc.get_subject_stats(db, semester)