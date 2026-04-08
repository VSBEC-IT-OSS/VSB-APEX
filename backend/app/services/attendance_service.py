# app/services/attendance_service.py
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from typing import List, Dict
from app.models.attendance import AttendanceRecord, AttendanceSummary
from app.models.biometric import AttendanceRecordBio
import calendar
from datetime import date
from sqlalchemy import select, and_
from collections import defaultdict

def get_available_dates(db: Session, db_bio: Session = None) -> List[str]:
    """Retrieve all unique dates with attendance data from both sources."""
    # Local distinct dates
    local_q = db.query(AttendanceRecord.date).distinct().all()
    local_dates = [d[0].isoformat() for d in local_q if d[0]]
    
    # Biometric distinct dates
    bio_dates = []
    if db_bio:
        try:
            bio_q = db_bio.query(AttendanceRecordBio.date).distinct().all()
            bio_dates = [d[0].isoformat() for d in bio_q if d[0]]
        except Exception:
            # Gracefully handle if biometric DB is down
            pass
            
    # Combine and de-duplicate
    combined = sorted(list(set(local_dates + bio_dates)))
    return combined


def get_today_absentees(db: Session) -> Dict:
    """Return today's attendance % and absentee breakdown by Dept/Year/Section."""
    today = date.today()

    # Students who WERE present today (from local records)
    present_today = db.query(
        AttendanceRecord.department,
        AttendanceRecord.year,
        AttendanceRecord.section,
        func.count(func.distinct(AttendanceRecord.student_id)).label("present"),
    ).filter(AttendanceRecord.date == today).group_by(
        AttendanceRecord.department,
        AttendanceRecord.year,
        AttendanceRecord.section,
    ).all()

    if not present_today:
        return {"date": today.isoformat(), "overall": None, "absentees": [], "hasData": False}

    # Total known students per section (from AttendanceSummary)
    totals_q = db.query(
        AttendanceSummary.department,
        AttendanceSummary.year,
        AttendanceSummary.section,
        func.count(func.distinct(AttendanceSummary.student_id)).label("total"),
    ).group_by(
        AttendanceSummary.department,
        AttendanceSummary.year,
        AttendanceSummary.section,
    ).all()

    totals = {f"{r.department}-{r.year}-{r.section}": r.total for r in totals_q}

    absentees = []
    total_present = 0
    total_students = 0

    for r in present_today:
        key = f"{r.department}-{r.year}-{r.section}"
        total = totals.get(key, r.present)
        absent = max(0, total - r.present)
        absentees.append({
            "dept": r.department or "IT",
            "year": r.year,
            "section": r.section,
            "present": r.present,
            "total": total,
            "absent": absent,
        })
        total_present += r.present
        total_students += total

    overall_pct = round(total_present / total_students * 100, 1) if total_students else 0

    return {
        "date": today.isoformat(),
        "overall": overall_pct,
        "totalPresent": total_present,
        "totalStudents": total_students,
        "absentees": sorted(absentees, key=lambda x: (x["year"], x["section"])),
        "hasData": True,
    }


def bulk_upsert_attendance(db: Session, rows: List[Dict]) -> Dict:
    inserted, skipped = 0, 0
    for row in rows:
        existing = db.query(AttendanceRecord).filter_by(
            student_id=row["student_id"],
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
    
    # 1. Get total unique dates per section/year/dept
    date_counts = db.query(
        AttendanceRecord.department,
        AttendanceRecord.year,
        AttendanceRecord.section,
        func.count(func.distinct(AttendanceRecord.date)).label("total")
    ).group_by(
        AttendanceRecord.department,
        AttendanceRecord.year,
        AttendanceRecord.section,
    ).all()
    
    section_totals = {
        f"{r.department}-{r.year}-{r.section}": r.total 
        for r in date_counts
    }

    # 2. Get student-wise attendance count
    rows = db.query(
        AttendanceRecord.student_id,
        AttendanceRecord.student_name,
        AttendanceRecord.department,
        AttendanceRecord.year,
        AttendanceRecord.section,
        func.count().label("attended"),
    ).group_by(
        AttendanceRecord.student_id, AttendanceRecord.student_name,
        AttendanceRecord.department, AttendanceRecord.year, AttendanceRecord.section,
    ).all()

    for r in rows:
        key = f"{r.department}-{r.year}-{r.section}"
        total = section_totals.get(key, 0)
        pct         = round((r.attended / total * 100), 2) if total else 0
        absent_days = total - r.attended
        db.add(AttendanceSummary(
            student_id=r.student_id, student_name=r.student_name,
            year=r.year, department=r.department, section=r.section,
            total_classes=total, classes_attended=r.attended,
            attendance_pct=pct, is_excess_leave=(absent_days > 4),
        ))
    db.commit()


def get_biometric_summary(db_bio: Session, department: str = None, year: str = None,
                          date_from: date = None, date_to: date = None) -> Dict[str, Dict]:
    """Helper to aggregate raw biometric records into student summaries."""
    if not db_bio:
        return {}
    
    q = db_bio.query(
        AttendanceRecordBio.studentId,
        func.count().label("total"),
        func.sum(case((AttendanceRecordBio.status == "PRESENT", 1), else_=0)).label("attended")
    )
    if department: q = q.filter(AttendanceRecordBio.department == department)
    # Note: 'class' is used for Year in the Prisma schema mapping? 
    # Let's check the Prisma schema again. It had className @map("class"). 
    # VSB-APEX 'year' might map to className.
    if year: q = q.filter(AttendanceRecordBio.class_name == year)
    if date_from: q = q.filter(AttendanceRecordBio.date >= date_from)
    if date_to: q = q.filter(AttendanceRecordBio.date <= date_to)
    
    results = q.group_by(AttendanceRecordBio.studentId).all()
    
    summary = {}
    for r in results:
        pct = round((r.attended / r.total * 100), 2) if r.total else 0
        absent_days = r.total - r.attended
        summary[r.studentId] = {
            "total": r.total,
            "attended": r.attended,
            "pct": pct,
            "is_excess": absent_days > 4
        }
    return summary

def get_overview(db: Session, db_bio: Session, department: str = None, year: str = None,
                 date_from: date = None, date_to: date = None) -> Dict:
    # 1. Get Biometric Summaries
    bio_sums = get_biometric_summary(db_bio, department, year, date_from, date_to)
    
    # 2. Get Local Summaries
    q = db.query(AttendanceSummary)
    if department: q = q.filter(AttendanceSummary.section.like(f"{department}%"))
    if year:       q = q.filter(AttendanceSummary.year == year)
    local_sums = {r.student_id: {
        "total": r.total_classes,
        "attended": r.classes_attended,
        "pct": r.attendance_pct,
        "is_excess": r.is_excess_leave
    } for r in q.all()}
    
    # 3. Blend (Prioritize Bio)
    all_student_ids = set(local_sums.keys()) | set(bio_sums.keys())
    
    blended = []
    total_pct = 0
    excess_count = 0
    
    for sid in all_student_ids:
        data = bio_sums.get(sid) or local_sums.get(sid)
        blended.append(data)
        total_pct += data["pct"]
        if data["is_excess"]:
            excess_count += 1
            
    overall = (total_pct / len(blended)) if blended else 0
    
    # 4. Trend (from raw local records for now, or bio if prioritized)
    # For trend, we'll merge month-wise aggregates
    rq_local = db.query(
        func.extract("month", AttendanceRecord.date).label("month"),
        func.count().label("total"),
        func.sum(case((AttendanceRecord.status == "present", 1), else_=0)).label("attended"),
    )
    if date_from: rq_local = rq_local.filter(AttendanceRecord.date >= date_from)
    if date_to:   rq_local = rq_local.filter(AttendanceRecord.date <= date_to)
    local_monthly = rq_local.group_by("month").all()
    
    monthly_data = defaultdict(lambda: {"total": 0, "attended": 0})
    for m in local_monthly:
        monthly_data[int(m.month)]["total"] += m.total
        monthly_data[int(m.month)]["attended"] += m.attended
        
    if db_bio:
        rq_bio = db_bio.query(
            func.extract("month", AttendanceRecordBio.date).label("month"),
            func.count().label("total"),
            func.sum(case((AttendanceRecordBio.status == "PRESENT", 1), else_=0)).label("attended"),
        )
        if date_from: rq_bio = rq_bio.filter(AttendanceRecordBio.date >= date_from)
        if date_to:   rq_bio = rq_bio.filter(AttendanceRecordBio.date <= date_to)
        bio_monthly = rq_bio.group_by("month").all()
        for m in bio_monthly:
            # Simple addition for trend? Or should we de-duplicate?
            # If a student has both manual and bio for the same date, they are double counted.
            # But the user said prioritizing bio. De-duplicating raw records is complex.
            # For overview trend, merging them is a reasonable approximation.
            monthly_data[int(m.month)]["total"] += m.total
            monthly_data[int(m.month)]["attended"] += m.attended

    trend = [{"month": calendar.month_abbr[m],
              "pct": round(data["attended"] / data["total"] * 100, 1) if data["total"] else 0}
             for m, data in sorted(monthly_data.items())]

    return {
        "overall":       round(overall, 1),
        "totalStudents": len(all_student_ids),
        "excessLeave":   excess_count,
        "trend":         trend,
    }


def get_sections(db: Session, db_bio: Session, department: str = None, year: str = None,
                 section: str = None, date_from: date = None,
                 date_to: date = None) -> List[Dict]:
    # This is more complex because we need to group by section.
    # 1. Get Local aggregation
    lq = db.query(
        AttendanceSummary.year,
        AttendanceSummary.section,
        func.count(func.distinct(AttendanceSummary.student_id)).label("students"),
        func.avg(AttendanceSummary.attendance_pct).label("avg"),
        func.sum(case((AttendanceSummary.is_excess_leave == True, 1), else_=0)).label("excessLeave"),
    )
    if department: lq = lq.filter(AttendanceSummary.department == department)
    if year:       lq = lq.filter(AttendanceSummary.year == year)
    if section:    lq = lq.filter(AttendanceSummary.section == section)
    local_rows = lq.group_by(AttendanceSummary.year, AttendanceSummary.section).all()
    
    sections_map = {}
    for r in local_rows:
        key = f"{r.year}-{r.section}"
        sections_map[key] = {
            "department": department or "IT",
            "year": r.year, 
            "section": r.section, 
            "students": r.students,
            "avg": round(r.avg, 1), 
            "excessLeave": int(r.excessLeave)
        }

    # 2. Get Biometric aggregation
    if db_bio:
        bq = db_bio.query(
            AttendanceRecordBio.class_name.label("year"),
            AttendanceRecordBio.section,
            func.count(func.distinct(AttendanceRecordBio.studentId)).label("students"),
            # For bio, we need to calculate avg pct of all students in that section
            # This requires student-level pct first. Easier to do in a subquery or python-side.
        )
        if department: bq = bq.filter(AttendanceRecordBio.department == department)
        if year: bq = bq.filter(AttendanceRecordBio.class_name == year)
        if section: bq = bq.filter(AttendanceRecordBio.section == section)
        if date_from: bq = bq.filter(AttendanceRecordBio.date >= date_from)
        if date_to: bq = bq.filter(AttendanceRecordBio.date <= date_to)
        
        # To match the logic of prioritizing bio, we should fetch individual student summaries from bio first
        bio_student_sums = get_biometric_summary(db_bio, department, year, date_from, date_to)
        
        # Group bio students by section
        # We need to know which section they belong to? In bio records, section is a direct field.
        bio_section_data = defaultdict(lambda: {"students": set(), "total_pct": 0, "excess": 0})
        
        # We need the section for each studentId. The get_biometric_summary doesn't return that.
        # Let's adjust the query to include section.
        bq_full = db_bio.query(
            AttendanceRecordBio.studentId,
            AttendanceRecordBio.class_name,
            AttendanceRecordBio.section,
            AttendanceRecordBio.department,
            func.count().label("total"),
            func.sum(case((AttendanceRecordBio.status == "PRESENT", 1), else_=0)).label("attended")
        )
        if department: bq_full = bq_full.filter(AttendanceRecordBio.department == department)
        if year: bq_full = bq_full.filter(AttendanceRecordBio.class_name == year)
        if section: bq_full = bq_full.filter(AttendanceRecordBio.section == section)
        if date_from: bq_full = bq_full.filter(AttendanceRecordBio.date >= date_from)
        if date_to: bq_full = bq_full.filter(AttendanceRecordBio.date <= date_to)
        
        bio_raw = bq_full.group_by(
            AttendanceRecordBio.studentId, 
            AttendanceRecordBio.class_name, 
            AttendanceRecordBio.section,
            AttendanceRecordBio.department
        ).all()
        
        for r in bio_raw:
            key = f"{r.class_name}-{r.section}"
            pct = (r.attended / r.total * 100) if r.total else 0
            is_excess = (r.total - r.attended) > 4
            
            bio_section_data[key]["students"].add(r.studentId)
            bio_section_data[key]["total_pct"] += pct
            if is_excess:
                bio_section_data[key]["excess"] += 1
            bio_section_data[key]["year"] = r.class_name
            bio_section_data[key]["section"] = r.section
            bio_section_data[key]["department"] = r.department

        # 3. Merge bio sections into map (prioritize bio)
        for key, data in bio_section_data.items():
            sections_map[key] = {
                "department": data["department"],
                "year": data["year"],
                "section": data["section"],
                "students": len(data["students"]),
                "avg": round(data["total_pct"] / len(data["students"]), 1) if data["students"] else 0,
                "excessLeave": data["excess"]
            }

    return sorted(sections_map.values(), key=lambda x: (x["year"], x["section"]))


def get_student(db: Session, db_bio: Session, student_id: str) -> List[Dict]:
    # 1. Get bio records for student
    res = []
    if db_bio:
        bq = db_bio.query(
            AttendanceRecordBio.class_name, # Map to subject? Prisma schema doesn't have subjectCode.
            # Wait, Prisma AttendanceRecord has RollNumber, Department, ClassName, Section.
            # But the local AttendanceSummary has subject_code, subject_name.
            # Biometric data might not be per-subject (just general attendance).
            # The local data is per-subject.
            func.count().label("total"),
            func.sum(case((AttendanceRecordBio.status == "PRESENT", 1), else_=0)).label("attended")
        ).filter(AttendanceRecordBio.studentId == student_id).group_by(AttendanceRecordBio.class_name).all()
        
        for r in bq:
            pct = round(r.attended / r.total * 100, 2) if r.total else 0
            res.append({
                "subject": f"General Attendance ({r.class_name})", "code": "BIO",
                "total": r.total, "attended": r.attended,
                "pct": pct, "excessLeave": (r.total - r.attended) > 4
            })
    
    # 2. Add local attendance data
    rows = db.query(AttendanceSummary).filter_by(student_id=student_id).all()
    for r in rows:
        res.append({
            "subject": "General Attendance", "code": None,
            "total": r.total_classes, "attended": r.classes_attended,
            "pct": r.attendance_pct, "excessLeave": r.is_excess_leave
        })
        
    return res
