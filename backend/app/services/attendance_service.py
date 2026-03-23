from sqlalchemy.orm import Session
from sqlalchemy import func, case
from typing import List, Dict
from app.models.attendance import AttendanceRecord, AttendanceSummary
import calendar
from datetime import date

def bulk_upsert_attendance(db: Session, rows: List[Dict]) -> Dict:
    inserted, skipped = 0, 0
    for row in rows:
        existing = db.query(AttendanceRecord).filter_by(
            student_id=row["student_id"],
            subject_code=row["subject_code"],
            date=row["date"],
        ).first()
        if existing:
            skipped += 1
            continue
        db.add(AttendanceRecord(**row))
        inserted += 1
    db.commit()
    return {"inserted": inserted, "skipped": skipped}


def recompute_summary(db: Session):
    """Recompute AttendanceSummary from raw records. Call after every upload."""
    db.query(AttendanceSummary).delete()
    rows = db.query(
        AttendanceRecord.student_id,
        AttendanceRecord.student_name,
        AttendanceRecord.year,
        AttendanceRecord.section,
        AttendanceRecord.subject_code,
        AttendanceRecord.subject_name,
        func.count().label("total"),
        func.sum(case((AttendanceRecord.status == "present", 1), else_=0)).label("attended"),
    ).group_by(
        AttendanceRecord.student_id, AttendanceRecord.student_name,
        AttendanceRecord.year, AttendanceRecord.section,
        AttendanceRecord.subject_code, AttendanceRecord.subject_name,
    ).all()

    for r in rows:
        pct = round((r.attended / r.total * 100), 2) if r.total else 0
        db.add(AttendanceSummary(
            student_id=r.student_id, student_name=r.student_name,
            year=r.year, section=r.section,
            subject_code=r.subject_code, subject_name=r.subject_name,
            total_classes=r.total, classes_attended=r.attended,
            attendance_pct=pct, is_below_75=(pct < 75),
        ))
    db.commit()


def get_overview(db: Session) -> Dict:
    total = db.query(func.count(func.distinct(AttendanceSummary.student_id))).scalar() or 0
    below = db.query(func.count(func.distinct(AttendanceSummary.student_id))).filter(
        AttendanceSummary.is_below_75 == True
    ).scalar() or 0
    overall = db.query(func.avg(AttendanceSummary.attendance_pct)).scalar() or 0

    # Month-wise trend from raw records
    monthly = db.query(
        func.extract("month", AttendanceRecord.date).label("month"),
        func.count().label("total"),
        func.sum(case((AttendanceRecord.status == "present", 1), else_=0)).label("attended"),
    ).group_by("month").order_by("month").all()

    trend = []
    for m in monthly:
        pct = round(m.attended / m.total * 100, 1) if m.total else 0
        trend.append({"month": calendar.month_abbr[int(m.month)], "pct": pct})

    return {
        "overall": round(overall, 1),
        "totalStudents": total,
        "belowThreshold": below,
        "aboveThreshold": total - below,
        "trend": trend,
    }


def get_sections(db: Session) -> List[Dict]:
    rows = db.query(
        AttendanceSummary.year,
        AttendanceSummary.section,
        func.count(func.distinct(AttendanceSummary.student_id)).label("students"),
        func.avg(AttendanceSummary.attendance_pct).label("avg"),
        func.sum(case((AttendanceSummary.is_below_75 == True, 1), else_=0)).label("below75"),
    ).group_by(AttendanceSummary.year, AttendanceSummary.section).all()

    return [
        {"year": r.year, "section": r.section,
         "students": r.students, "avg": round(r.avg, 1), "below75": int(r.below75)}
        for r in rows
    ]


def get_student(db: Session, student_id: str) -> List[Dict]:
    rows = db.query(AttendanceSummary).filter_by(student_id=student_id).all()
    return [
        {"subject": r.subject_name or r.subject_code, "code": r.subject_code,
         "total": r.total_classes, "attended": r.classes_attended,
         "pct": r.attendance_pct, "below75": r.is_below_75}
        for r in rows
    ]
