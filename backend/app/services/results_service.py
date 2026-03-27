# app/services/results_service.py
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from typing import List, Dict
from app.models.results import Result

def bulk_upsert_results(db: Session, rows: List[Dict]) -> Dict:
    inserted, skipped = 0, 0
    for row in rows:
        existing = db.query(Result).filter_by(
            student_id=row["student_id"],
            subject_code=row["subject_code"],
            semester=row["semester"],
        ).first()
        if existing:
            skipped += 1
            continue
        db.add(Result(**row))
        inserted += 1
    db.commit()
    return {"inserted": inserted, "skipped": skipped}


def get_overview(db: Session) -> Dict:
    total = db.query(func.count(func.distinct(Result.student_id))).scalar() or 1
    fail_count = db.query(func.count()).filter(Result.is_pass == False).scalar() or 0
    pass_count = db.query(func.count()).filter(Result.is_pass == True).scalar() or 0
    total_results = pass_count + fail_count or 1
    avg_total = db.query(func.avg(Result.total_marks)).scalar() or 0
    # Approximate CGPA from total marks (out of 100 → /10)
    avg_cgpa = round(avg_total / 10, 2)

    sem_rows = db.query(
        Result.semester,
        func.count().label("total"),
        func.sum(case((Result.is_pass == True, 1), else_=0)).label("passed"),
    ).group_by(Result.semester).order_by(Result.semester).all()

    trend = [
        {"sem": f"Sem {r.semester}", "pass": round(r.passed / r.total * 100, 1)}
        for r in sem_rows if r.total
    ]

    return {
        "overallPassPct": round(pass_count / total_results * 100, 1),
        "totalStudents": total,
        "failCount": fail_count,
        "avgCGPA": avg_cgpa,
        "trend": trend,
    }


def get_subject_analysis(db: Session) -> List[Dict]:
    rows = db.query(
        Result.subject_code,
        Result.subject_name,
        func.count().label("total"),
        func.sum(case((Result.is_pass == True, 1), else_=0)).label("passed"),
        func.avg(Result.total_marks).label("avg_marks"),
        func.sum(case((Result.has_arrear == True, 1), else_=0)).label("arrears"),
    ).group_by(Result.subject_code, Result.subject_name).all()

    return [
        {
            "subject": r.subject_name or r.subject_code,
            "code": r.subject_code,
            "passP": round(r.passed / r.total * 100, 1) if r.total else 0,
            "avgMarks": round(r.avg_marks, 1) if r.avg_marks else 0,
            "arrears": int(r.arrears),
        }
        for r in rows
    ]


def get_section_results(db: Session) -> List[Dict]:
    rows = db.query(
        Result.year,
        Result.section,
        func.count(func.distinct(Result.student_id)).label("students"),
        func.sum(case((Result.is_pass == True, 1), else_=0)).label("passed"),
        func.count().label("total"),
        func.avg(Result.total_marks).label("avg_marks"),
        func.sum(case((Result.has_arrear == True, 1), else_=0)).label("arrears"),
    ).group_by(Result.year, Result.section).all()

    return [
        {
            "year": r.year, "section": r.section,
            "passP": round(r.passed / r.total * 100, 1) if r.total else 0,
            "avgCGPA": round((r.avg_marks or 0) / 10, 2),
            "arrears": int(r.arrears),
        }
        for r in rows
    ]
