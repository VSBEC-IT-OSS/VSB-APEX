# app/api/routes/internal.py
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from typing import Optional
from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.internal_test import InternalTest

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
