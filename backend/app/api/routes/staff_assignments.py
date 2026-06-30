# app/api/routes/staff_assignments.py
"""
Staff Assignment routes (HOD manages which sections their staff can access):
  GET    /api/staff-assignments         — list assignments (admin/hod sees their dept's)
  POST   /api/staff-assignments         — create assignment (hod for own dept, admin any)
  DELETE /api/staff-assignments/{id}    — remove assignment
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, require_admin_or_hod, get_db
from app.models.user import User
from app.models.staff_assignment import StaffAssignment

router = APIRouter(prefix="/staff-assignments", tags=["Staff Assignments"])


class AssignmentCreate(BaseModel):
    user_id:    int
    department: str
    batch:      str           # "2023-2027"
    section:    Optional[str] = None  # None = all sections in dept/batch


class AssignmentOut(BaseModel):
    id:         int
    user_id:    int
    department: str
    batch:      str
    section:    Optional[str]
    created_by: Optional[int]

    class Config:
        from_attributes = True


@router.get("", response_model=List[AssignmentOut])
def list_assignments(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_hod),
):
    q = db.query(StaffAssignment)
    if current_user.role == "hod" and current_user.department:
        q = q.filter(StaffAssignment.department == current_user.department)
    return q.all()


@router.post("", response_model=AssignmentOut, status_code=201)
def create_assignment(
    data: AssignmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_hod),
):
    # HODs can only assign within their own department
    if current_user.role == "hod":
        if not current_user.department or data.department != current_user.department:
            raise HTTPException(
                status_code=403,
                detail="HODs can only assign staff within their own department"
            )
    # Verify target user exists and is staff
    target = db.query(User).filter_by(id=data.user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target user not found")
    if target.role != "staff":
        raise HTTPException(status_code=400, detail="Assignments can only be created for staff users")

    # Check duplicate
    existing = db.query(StaffAssignment).filter_by(
        user_id=data.user_id,
        department=data.department,
        batch=data.batch,
        section=data.section,
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="This assignment already exists")

    assignment = StaffAssignment(
        user_id=data.user_id,
        department=data.department,
        batch=data.batch,
        section=data.section,
        created_by=current_user.id,
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


@router.delete("/{assignment_id}", status_code=204)
def delete_assignment(
    assignment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_hod),
):
    assignment = db.query(StaffAssignment).filter_by(id=assignment_id).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    # HODs can't delete assignments outside their dept
    if current_user.role == "hod" and assignment.department != current_user.department:
        raise HTTPException(status_code=403, detail="Cannot modify assignments outside your department")
    db.delete(assignment)
    db.commit()
