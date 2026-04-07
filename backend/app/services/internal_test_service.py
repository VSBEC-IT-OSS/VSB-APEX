# app/services/internal_test_service.py
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Dict
from app.models.internal_test import InternalTest


def get_latest_test_toppers(db: Session, top_n: int = 3) -> Dict:
    """
    Find the most recent test number in the DB, then return top_n students
    per (year, section) group, ordered by marks_scored desc.
    """
    latest_test = db.query(func.max(InternalTest.test_number)).scalar()
    if latest_test is None:
        return {"testNumber": None, "toppers": []}

    # Aggregate total marks per student for the latest test
    rows = db.query(
        InternalTest.student_id,
        InternalTest.student_name,
        InternalTest.year,
        InternalTest.section,
        func.sum(InternalTest.marks_scored).label("total"),
        func.sum(InternalTest.max_marks).label("max_total"),
    ).filter(InternalTest.test_number == latest_test).group_by(
        InternalTest.student_id,
        InternalTest.student_name,
        InternalTest.year,
        InternalTest.section,
    ).all()

    # Group by (year, section) and pick top_n per group
    groups: Dict[str, list] = {}
    for r in rows:
        key = f"{r.year}-{r.section}"
        groups.setdefault(key, []).append({
            "studentId": r.student_id,
            "name": r.student_name or r.student_id,
            "year": r.year,
            "section": r.section,
            "marksScored": round(r.total, 1),
            "maxMarks": round(r.max_total, 1),
            "percentage": round(r.total / r.max_total * 100, 1) if r.max_total else 0,
        })

    toppers = []
    for key in sorted(groups.keys()):
        group = sorted(groups[key], key=lambda x: x["marksScored"], reverse=True)[:top_n]
        toppers.append({
            "year": group[0]["year"],
            "section": group[0]["section"],
            "students": group,
        })

    return {"testNumber": latest_test, "toppers": toppers}


def get_internal_overview(db: Session) -> Dict:
    """Overall stats for internal tests."""
    latest_test = db.query(func.max(InternalTest.test_number)).scalar()
    if not latest_test:
        return {"latestTest": None, "avgScore": 0, "totalRecords": 0}

    rows = db.query(
        func.avg(InternalTest.marks_scored).label("avg"),
        func.count().label("total"),
    ).filter(InternalTest.test_number == latest_test).first()

    return {
        "latestTest": latest_test,
        "avgScore": round(rows.avg, 1) if rows.avg else 0,
        "totalRecords": rows.total or 0,
    }
