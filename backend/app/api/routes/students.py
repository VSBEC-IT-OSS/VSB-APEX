# app/api/routes/students.py
"""
Student management routes:
  GET  /api/students                    — list students (admin/hod)
  POST /api/students                    — create student (admin only)
  PATCH /api/students/{id}              — update student (admin only)
  DELETE /api/students/{id}             — delete student (admin only)
  GET  /api/students/search?q=...       — spotlight search by name/reg_number
  GET  /api/students/{reg_number}/profile — 360-degree aggregated profile
"""
from datetime import date
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func as sqlfunc

from app.api.deps import get_current_user, require_role, require_admin, require_admin_or_hod, get_db
from app.models.user import User
from app.models.student import Student
from app.models.attendance import AttendanceSummary
from app.models.results import Result
from app.models.internal_test import InternalTest
from app.models.placement import Placement

router = APIRouter(prefix="/students", tags=["Students"])


# ── Schemas ───────────────────────────────────────────────────────────────────

class StudentCreate(BaseModel):
    reg_number:  str
    name:        str
    email:       Optional[str] = None
    department:  str
    section:     Optional[str] = None
    batch:       str            # e.g. "2023-2027"

class StudentUpdate(BaseModel):
    name:       Optional[str] = None
    email:      Optional[str] = None
    department: Optional[str] = None
    section:    Optional[str] = None
    batch:      Optional[str] = None
    is_active:  Optional[int] = None

class StudentOut(BaseModel):
    id:         int
    reg_number: str
    name:       str
    email:      Optional[str]
    department: str
    section:    Optional[str]
    batch:      str
    current_year: Optional[int] = None  # computed
    is_active:  int

    class Config:
        from_attributes = True


def _compute_year(batch: str) -> Optional[int]:
    """Given batch like '2023-2027', compute current year of study (1-4)."""
    try:
        start_year = int(batch.split("-")[0])
        current_academic_year = date.today().year if date.today().month >= 7 else date.today().year - 1
        year = (current_academic_year - start_year) + 1
        return max(1, min(4, year))
    except Exception:
        return None


def _student_out(s: Student) -> dict:
    data = StudentOut.model_validate(s).model_dump()
    data["current_year"] = _compute_year(s.batch)
    return data


# ── Routes ────────────────────────────────────────────────────────────────────

@router.get("/search")
def search_students(
    q: str = Query(..., min_length=2),
    db: Session = Depends(get_db),
    _: User = Depends(require_admin_or_hod),
):
    """Spotlight search — returns students matching reg_number or name."""
    pattern = f"%{q}%"
    results = db.query(Student).filter(
        (Student.reg_number.ilike(pattern)) | (Student.name.ilike(pattern))
    ).limit(20).all()
    return [_student_out(s) for s in results]


@router.get("", response_model=List[dict])
def list_students(
    department:  Optional[str] = Query(None),
    batch:       Optional[str] = Query(None),
    section:     Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_hod),
):
    q = db.query(Student)
    # HOD: if they have a department set, only return their dept unless admin overrides
    if current_user.role == "hod" and current_user.department and not department:
        q = q.filter(Student.department == current_user.department)
    elif department:
        q = q.filter(Student.department == department)
    if batch:
        q = q.filter(Student.batch == batch)
    if section:
        q = q.filter(Student.section == section)
    return [_student_out(s) for s in q.order_by(Student.reg_number).all()]


@router.post("", status_code=201)
def create_student(
    data: StudentCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    if db.query(Student).filter_by(reg_number=data.reg_number).first():
        raise HTTPException(status_code=409, detail="Student with this reg_number already exists")
    student = Student(**data.model_dump())
    db.add(student)
    db.commit()
    db.refresh(student)
    return _student_out(student)


@router.patch("/{student_id}")
def update_student(
    student_id: int,
    data: StudentUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    student = db.query(Student).filter_by(id=student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    for field, val in data.model_dump(exclude_none=True).items():
        setattr(student, field, val)
    db.commit()
    db.refresh(student)
    return _student_out(student)


@router.delete("/{student_id}", status_code=204)
def delete_student(
    student_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    student = db.query(Student).filter_by(id=student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(student)
    db.commit()


# ── 360-Degree Student Profile ────────────────────────────────────────────────

@router.get("/{reg_number}/profile")
def student_profile(
    reg_number: str,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin_or_hod),
):
    """
    Returns a single comprehensive JSON payload covering:
    - Core student info (from Student table)
    - Attendance summary
    - Results per semester (with CGPA trend + arear list)
    - Internal test scores + class averages
    - Placement records
    - Computed status badge: SAFE / AT_RISK / CRITICAL
    """
    student = db.query(Student).filter_by(reg_number=reg_number).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # --- Attendance ---
    att = db.query(AttendanceSummary).filter_by(student_id=reg_number).first()
    attendance_data = {
        "total_classes":    att.total_classes    if att else 0,
        "classes_attended": att.classes_attended if att else 0,
        "attendance_pct":   round(att.attendance_pct, 2) if att else 0.0,
        "is_excess_leave":  att.is_excess_leave  if att else False,
    }

    # --- Results (group by semester) ---
    results_rows = db.query(Result).filter_by(student_id=reg_number).order_by(Result.semester).all()
    semesters: dict = {}
    arrears: list   = []
    for r in results_rows:
        sem = r.semester
        if sem not in semesters:
            semesters[sem] = {"semester": sem, "subjects": [], "avg_marks": 0.0, "pass_count": 0, "total": 0}
        semesters[sem]["subjects"].append({
            "code": r.subject_code, "name": r.subject_name,
            "total": r.total_marks, "grade": r.grade, "is_pass": r.is_pass
        })
        semesters[sem]["total"] += 1
        if r.is_pass:
            semesters[sem]["pass_count"] += 1
        if r.has_arrear:
            arrears.append({"semester": sem, "subject_code": r.subject_code, "subject_name": r.subject_name})

    for sem_data in semesters.values():
        subjects = sem_data["subjects"]
        sem_data["avg_marks"] = round(
            sum(s["total"] for s in subjects) / len(subjects), 2
        ) if subjects else 0.0

    semester_list = sorted(semesters.values(), key=lambda x: x["semester"])

    # --- Internal Tests ---
    internals = db.query(InternalTest).filter_by(student_id=reg_number).order_by(
        InternalTest.subject_code, InternalTest.test_number
    ).all()
    internal_data = []
    
    # Get class averages for subjects this student took
    subject_codes = list({i.subject_code for i in internals})
    class_avgs = {}
    for sc in subject_codes:
        avg = db.query(sqlfunc.avg(InternalTest.marks_scored)).filter_by(subject_code=sc).scalar()
        class_avgs[sc] = round(float(avg), 2) if avg else 0.0
    
    for it in internals:
        internal_data.append({
            "subject_code": it.subject_code,
            "subject_name": it.subject_name,
            "test_number":  it.test_number,
            "marks_scored": it.marks_scored,
            "max_marks":    it.max_marks,
            "class_avg":    class_avgs.get(it.subject_code, 0.0),
        })

    # --- Placements ---
    placements_rows = db.query(Placement).filter_by(student_id=reg_number).all()
    placement_data = [
        {
            "company":     p.company,
            "package_lpa": p.package_lpa,
            "offer_type":  p.offer_type,
            "batch":       p.batch,
        }
        for p in placements_rows
    ]

    # --- Compute Status Badge ---
    pct   = attendance_data["attendance_pct"]
    n_arr = len(arrears)
    if pct < 65 or n_arr >= 3:
        status_badge = "CRITICAL"
    elif pct < 75 or n_arr >= 1:
        status_badge = "AT_RISK"
    else:
        status_badge = "SAFE"

    return {
        "student": {
            "reg_number":   student.reg_number,
            "name":         student.name,
            "email":        student.email,
            "department":   student.department,
            "section":      student.section,
            "batch":        student.batch,
            "current_year": _compute_year(student.batch),
        },
        "status_badge": status_badge,
        "attendance":   attendance_data,
        "results": {
            "semesters":      semester_list,
            "active_arrears": arrears,
        },
        "internal_tests": internal_data,
        "placements":     placement_data,
    }
