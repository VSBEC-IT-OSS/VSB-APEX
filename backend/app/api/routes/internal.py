# app/api/routes/internal.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from typing import Optional
from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.internal_test import InternalTest
from app.services import internal_test_service as it_svc

router = APIRouter(prefix="/internal", tags=["Internal Tests"])

@router.get("/overview")
def overview(db: Session = Depends(get_db), _=Depends(get_current_user)):
    total_students = db.query(func.count(func.distinct(InternalTest.student_id))).scalar() or 0
    avg = db.query(func.avg(InternalTest.marks_scored / InternalTest.max_marks * 100)).scalar() or 0
    below50 = db.query(func.count(func.distinct(InternalTest.student_id))).filter(
        InternalTest.marks_scored < InternalTest.max_marks * 0.5
    ).scalar() or 0
    tests = db.query(func.max(InternalTest.test_number)).scalar() or 0
    return {
        "avgScore": round(avg, 1),
        "totalStudents": total_students,
        "below50Pct": below50,
        "tests": tests,
    }

@router.get("/section")
def by_section(
    year: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    rows = db.query(
        InternalTest.year, InternalTest.section, InternalTest.test_number,
        func.avg(InternalTest.marks_scored / InternalTest.max_marks * 100).label("avg_pct"),
        func.sum(case((InternalTest.marks_scored < InternalTest.max_marks * 0.5, 1), else_=0)).label("below50"),
    ).group_by(InternalTest.year, InternalTest.section, InternalTest.test_number).all()

    # Pivot by section
    pivot = {}
    for r in rows:
        key = (r.year, r.section)
        if key not in pivot:
            pivot[key] = {"year": r.year, "section": r.section, "avgT1": 0, "avgT2": 0, "avgT3": 0, "below50": 0}
        pivot[key][f"avgT{r.test_number}"] = round(r.avg_pct, 1)
        pivot[key]["below50"] = max(pivot[key]["below50"], int(r.below50))

    result = list(pivot.values())
    if year:
        result = [r for r in result if r["year"] == year]
    return result

@router.get("/subject")
def by_subject(db: Session = Depends(get_db), _=Depends(get_current_user)):
    rows = db.query(
        InternalTest.subject_code, InternalTest.subject_name,
        InternalTest.test_number,
        func.avg(InternalTest.marks_scored / InternalTest.max_marks * 100).label("avg_pct"),
    ).group_by(InternalTest.subject_code, InternalTest.subject_name, InternalTest.test_number).all()

    pivot = {}
    for r in rows:
        key = r.subject_code
        if key not in pivot:
            pivot[key] = {"subject": r.subject_name or r.subject_code, "code": r.subject_code,
                          "avgT1": 0, "avgT2": 0, "avgT3": 0}
        pivot[key][f"avgT{r.test_number}"] = round(r.avg_pct, 1)

    result = list(pivot.values())
    for s in result:
        scores = [s["avgT1"], s["avgT2"], s["avgT3"]]
        if scores[2] > scores[0] + 2:   s["trend"] = "up"
        elif scores[2] < scores[0] - 2: s["trend"] = "down"
        else:                            s["trend"] = "flat"
    return result


@router.get("/toppers")
def latest_toppers(
    top_n: int = Query(3, ge=1, le=10),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    """Top students per year/section for the most recent internal test."""
    return it_svc.get_latest_test_toppers(db, top_n)


# ─── V2 Endpoints with semester and department support ───────────────────

@router.get("/years")
def get_available_years(db: Session = Depends(get_db), _=Depends(get_current_user)):
    """Get available years from database"""
    years = db.query(func.distinct(InternalTest.year)).all()
    return [y[0] for y in years if y[0]]

@router.get("/year-overview-v2")
def year_overview_v2(
    year: Optional[str] = Query(None),
    semester: Optional[int] = Query(None),
    section: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_user)
):
    """Get year-wise overview with section breakdown, semester and department filtering"""
    rows = db.query(
        InternalTest.year,
        InternalTest.section,
        func.count(func.distinct(InternalTest.student_id)).label("total_students"),
    ).group_by(InternalTest.year, InternalTest.section)
    
    if year:
        rows = rows.filter(InternalTest.year == year)
    if semester:
        rows = rows.filter(InternalTest.semester == semester)
    if section and section != "All":
        rows = rows.filter(InternalTest.section == section)
    if department:
        rows = rows.filter(InternalTest.department == department)
    
    rows = rows.all()
    
    result = []
    for r in rows:
        total = r.total_students or 0
        
        # Count students who passed
        passed_query = db.query(
            func.count(func.distinct(InternalTest.student_id))
        ).filter(
            InternalTest.year == r.year,
            InternalTest.section == r.section,
            InternalTest.marks_scored >= InternalTest.max_marks * 0.5
        )
        if semester:
            passed_query = passed_query.filter(InternalTest.semester == semester)
        if department:
            passed_query = passed_query.filter(InternalTest.department == department)
        
        passed = passed_query.scalar() or 0
        pass_pct = round((passed / total * 100), 1) if total > 0 else 0
        
        # Get subjects below 50%
        subj_rows = db.query(
            InternalTest.subject_code,
            InternalTest.subject_name,
            func.avg(InternalTest.marks_scored / InternalTest.max_marks * 100).label("avg_pct"),
        ).filter(
            InternalTest.year == r.year,
            InternalTest.section == r.section
        )
        if semester:
            subj_rows = subj_rows.filter(InternalTest.semester == semester)
        if department:
            subj_rows = subj_rows.filter(InternalTest.department == department)
        
        subj_rows = subj_rows.group_by(InternalTest.subject_code, InternalTest.subject_name).all()
        
        subjects_below_50 = [
            {"code": s.subject_code, "name": s.subject_name, "pass_pct": round(s.avg_pct, 1)}
            for s in subj_rows if s.avg_pct < 50
        ]
        
        result.append({
            "year": r.year,
            "section": r.section,
            "total_students": total,
            "students_passed": passed,
            "pass_percentage": pass_pct,
            "subjects_below_50": subjects_below_50
        })
    
    return result

@router.get("/section-comparison-v2")
def section_comparison_v2(
    year: Optional[str] = Query(None),
    semester: Optional[int] = Query(None),
    department: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_user)
):
    """Get section-wise comparison with semester and department filtering"""
    q = db.query(
        InternalTest.year,
        InternalTest.section,
        InternalTest.test_number,
        func.avg(InternalTest.marks_scored / InternalTest.max_marks * 100).label("avg_pct"),
        func.count(func.distinct(InternalTest.student_id)).label("total_students"),
        func.sum(case((InternalTest.marks_scored >= InternalTest.max_marks * 0.5, 1), else_=0)).label("passed"),
    ).group_by(InternalTest.year, InternalTest.section, InternalTest.test_number)
    
    if year:
        q = q.filter(InternalTest.year == year)
    if semester:
        q = q.filter(InternalTest.semester == semester)
    if department:
        q = q.filter(InternalTest.department == department)
    
    rows = q.all()
    
    pivot = {}
    for r in rows:
        key = (r.year, r.section)
        if key not in pivot:
            pivot[key] = {
                "year": r.year,
                "section": r.section,
                "test1": {"avg_pct": 0, "total": 0, "passed": 0},
                "test2": {"avg_pct": 0, "total": 0, "passed": 0},
                "test3": {"avg_pct": 0, "total": 0, "passed": 0},
            }
        
        test_key = f"test{r.test_number}"
        pivot[key][test_key] = {
            "avg_pct": round(r.avg_pct, 1),
            "total": r.total_students,
            "passed": r.passed or 0
        }
    
    return list(pivot.values())

@router.get("/subject-performance-v2")
def subject_performance_v2(
    year: Optional[str] = Query(None),
    semester: Optional[int] = Query(None),
    section: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _=Depends(get_current_user)
):
    """Get subject-wise performance with semester and department filtering"""
    q = db.query(
        InternalTest.subject_code,
        InternalTest.subject_name,
        func.avg(InternalTest.marks_scored / InternalTest.max_marks * 100).label("avg_pct"),
        func.count(func.distinct(InternalTest.student_id)).label("total_students"),
    ).group_by(InternalTest.subject_code, InternalTest.subject_name)
    
    if year:
        q = q.filter(InternalTest.year == year)
    if semester:
        q = q.filter(InternalTest.semester == semester)
    if section and section != "All":
        q = q.filter(InternalTest.section == section)
    if department:
        q = q.filter(InternalTest.department == department)
    
    rows = q.all()
    
    result = []
    for r in rows:
        total = r.total_students or 0
        
        passed_query = db.query(
            func.count(func.distinct(InternalTest.student_id))
        ).filter(
            InternalTest.subject_code == r.subject_code,
            InternalTest.marks_scored >= InternalTest.max_marks * 0.5
        )
        if year:
            passed_query = passed_query.filter(InternalTest.year == year)
        if semester:
            passed_query = passed_query.filter(InternalTest.semester == semester)
        if section and section != "All":
            passed_query = passed_query.filter(InternalTest.section == section)
        if department:
            passed_query = passed_query.filter(InternalTest.department == department)
        
        passed = passed_query.scalar() or 0
        failed = total - passed
        pass_pct = round((passed / total * 100), 1) if total > 0 else 0
        
        result.append({
            "code": r.subject_code,
            "name": r.subject_name,
            "avg_pct": round(r.avg_pct, 1),
            "total_students": total,
            "passed": passed,
            "failed": failed,
            "pass_percentage": pass_pct,
            "is_below_50": r.avg_pct < 50
        })
    
    return result
