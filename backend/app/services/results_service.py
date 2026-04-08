# backend/app/services/results_service.py
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from typing import List, Dict, Optional
from app.models.results import Result

def bulk_upsert_results(db: Session, rows: List[Dict]) -> Dict:
    """Insert or skip duplicate result records"""
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
    """Get overall results summary"""
    total = db.query(func.count(func.distinct(Result.student_id))).scalar() or 1
    fail_count = db.query(func.count()).filter(Result.is_pass == False).scalar() or 0
    pass_count = db.query(func.count()).filter(Result.is_pass == True).scalar() or 0
    total_results = pass_count + fail_count or 1
    avg_total = db.query(func.avg(Result.total_marks)).scalar() or 0
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
    """Get subject-wise performance analysis"""
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
    """Get section-wise results summary"""
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


def get_results_by_semester(db: Session, semester: Optional[int] = None, section: Optional[str] = None) -> List[Dict]:
    """Get all result records, optionally filtered"""
    query = db.query(Result)
    
    if semester is not None:
        query = query.filter(Result.semester == semester)
    if section is not None:
        query = query.filter(Result.section == section)
    
    rows = query.all()
    
    return [
        {
            "id": r.id,
            "student_id": r.student_id,
            "student_name": r.student_name,
            "year": r.year,
            "section": r.section,
            "semester": r.semester,
            "subject_code": r.subject_code,
            "subject_name": r.subject_name,
            "internal_marks": r.internal_marks,
            "external_marks": r.external_marks,
            "total_marks": r.total_marks,
            "grade": r.grade,
            "is_pass": r.is_pass,
            "has_arrear": r.has_arrear,
            "uploaded_at": r.uploaded_at.isoformat() if r.uploaded_at else None,
        }
        for r in rows
    ]


def get_semester_section_analysis(db: Session, semester: int, section: str) -> Dict:
    """Get detailed analysis for specific semester and section"""
    results = db.query(Result).filter(
        Result.semester == semester,
        Result.section == section
    ).all()
    
    if not results:
        return {"total_students": 0, "total_records": 0, "pass_percentage": 0, "avg_marks": 0}
    
    total_records = len(results)
    students = len(set(r.student_id for r in results))
    pass_count = sum(1 for r in results if r.is_pass)
    total_marks_sum = sum(r.total_marks for r in results)
    
    # Group by subject
    subjects = {}
    for r in results:
        key = r.subject_code
        if key not in subjects:
            subjects[key] = {
                "code": r.subject_code,
                "name": r.subject_name,
                "students": 0,
                "passed": 0,
                "total_marks": 0,
                "arrears": 0
            }
        subjects[key]["students"] += 1
        if r.is_pass:
            subjects[key]["passed"] += 1
        subjects[key]["total_marks"] += r.total_marks
        if r.has_arrear:
            subjects[key]["arrears"] += 1
    
    subject_list = []
    for s in subjects.values():
        subject_list.append({
            "code": s["code"],
            "name": s["name"],
            "passP": round((s["passed"] / s["students"]) * 100, 1) if s["students"] > 0 else 0,
            "avgMarks": round((s["total_marks"] / s["students"]), 1) if s["students"] > 0 else 0,
            "arrears": s["arrears"]
        })
    
    return {
        "semester": semester,
        "section": section,
        "total_students": students,
        "total_records": total_records,
        "pass_percentage": round((pass_count / total_records) * 100, 1) if total_records > 0 else 0,
        "avg_marks": round(total_marks_sum / total_records, 1) if total_records > 0 else 0,
        "subjects": sorted(subject_list, key=lambda x: x["passP"])
    }


def get_student_results(db: Session, student_id: str) -> List[Dict]:
    """Get all results for a specific student"""
    rows = db.query(Result).filter(Result.student_id == student_id).order_by(Result.semester).all()
    
    return [
        {
            "semester": r.semester,
            "subject_code": r.subject_code,
            "subject_name": r.subject_name,
            "internal_marks": r.internal_marks,
            "external_marks": r.external_marks,
            "total_marks": r.total_marks,
            "grade": r.grade,
            "is_pass": r.is_pass,
        }
        for r in rows
    ]


def get_semester_trend(db: Session, section: Optional[str] = None) -> List[Dict]:
    """Get pass % trend across semesters"""
    query = db.query(
        Result.semester,
        func.count().label("total"),
        func.sum(case((Result.is_pass == True, 1), else_=0)).label("passed"),
    )
    
    if section:
        query = query.filter(Result.section == section)
    
    rows = query.group_by(Result.semester).order_by(Result.semester).all()
    
    return [
        {
            "sem": f"Sem {r.semester}",
            "pass": round((r.passed / r.total) * 100, 1) if r.total > 0 else 0,
            "total": r.total,
            "passed": r.passed
        }
        for r in rows
    ]


def get_section_comparison(db: Session, semester: int) -> List[Dict]:
    """Get section-wise comparison for specific semester"""
    rows = db.query(
        Result.section,
        func.count().label("total"),
        func.sum(case((Result.is_pass == True, 1), else_=0)).label("passed"),
        func.avg(Result.total_marks).label("avg_marks"),
        func.sum(case((Result.has_arrear == True, 1), else_=0)).label("arrears"),
    ).filter(Result.semester == semester).group_by(Result.section).order_by(Result.section).all()
    
    return [
        {
            "section": r.section,
            "passP": round((r.passed / r.total) * 100, 1) if r.total > 0 else 0,
            "avgMarks": round(r.avg_marks, 1) if r.avg_marks else 0,
            "arrears": int(r.arrears),
            "total": r.total
        }
        for r in rows
    ]


def get_subject_stats(db: Session, semester: Optional[int] = None) -> List[Dict]:
    """Get statistics for each subject"""
    query = db.query(
        Result.subject_code,
        Result.subject_name,
        func.count().label("total"),
        func.sum(case((Result.is_pass == True, 1), else_=0)).label("passed"),
        func.avg(Result.total_marks).label("avg_marks"),
        func.avg(Result.internal_marks).label("avg_internal"),
        func.avg(Result.external_marks).label("avg_external"),
        func.sum(case((Result.has_arrear == True, 1), else_=0)).label("arrears"),
    )
    
    if semester is not None:
        query = query.filter(Result.semester == semester)
    
    rows = query.group_by(Result.subject_code, Result.subject_name).all()
    
    return [
        {
            "code": r.subject_code,
            "name": r.subject_name,
            "total_records": r.total,
            "passP": round((r.passed / r.total) * 100, 1) if r.total > 0 else 0,
            "avgMarks": round(r.avg_marks, 1) if r.avg_marks else 0,
            "avgInternal": round(r.avg_internal, 1) if r.avg_internal else 0,
            "avgExternal": round(r.avg_external, 1) if r.avg_external else 0,
            "arrears": int(r.arrears)
        }
        for r in rows
    ]


def get_arrear_summary(db: Session) -> List[Dict]:
    """Return arrear counts grouped by year and section."""
    rows = db.query(
        Result.year,
        Result.section,
        func.count(func.distinct(Result.student_id)).label("total_students"),
        func.count(func.distinct(
            case((Result.has_arrear == True, Result.student_id), else_=None)
        )).label("with_arrears"),
    ).group_by(Result.year, Result.section).order_by(Result.year, Result.section).all()

    return [
        {
            "year": r.year,
            "section": r.section,
            "totalStudents": r.total_students,
            "withArrears": r.with_arrears,
        }
        for r in rows
    ]


def get_department_totals(db: Session) -> Dict:
    """Return total student count and arrear counts for the department."""
    total = db.query(func.count(func.distinct(Result.student_id))).scalar() or 0
    with_arrears = db.query(func.count(func.distinct(Result.student_id))).filter(
        Result.has_arrear == True
    ).scalar() or 0
    # Count distinct students who have at least one passing result
    passed_students = db.query(func.count(func.distinct(Result.student_id))).filter(
        Result.is_pass == True
    ).scalar() or 0
    pass_pct = round(
        passed_students / max(total, 1) * 100, 1
    )
    return {
        "totalStudents": total,
        "withArrears": with_arrears,
        "passPercentage": pass_pct,
    }


def get_cgpa_toppers(db: Session, limit: int = 5) -> List[Dict]:
    """Return top students by average total marks (proxy CGPA), latest semester."""
    # Get the latest semester in DB
    latest_sem = db.query(func.max(Result.semester)).scalar()
    if not latest_sem:
        return []

    rows = db.query(
        Result.student_id,
        Result.student_name,
        Result.year,
        Result.section,
        func.avg(Result.total_marks).label("avg_marks"),
    ).filter(Result.semester == latest_sem).group_by(
        Result.student_id, Result.student_name, Result.year, Result.section,
    ).order_by(func.avg(Result.total_marks).desc()).limit(limit).all()

    return [
        {
            "studentId": r.student_id,
            "name": r.student_name or r.student_id,
            "year": r.year,
            "section": r.section,
            "avgMarks": round(r.avg_marks, 1) if r.avg_marks else 0,
            "cgpa": round((r.avg_marks or 0) / 10, 2),
            "semester": latest_sem,
        }
        for r in rows
    ]
