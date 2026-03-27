# app/services/goals_service.py
from sqlalchemy.orm import Session
from sqlalchemy import func,case
from app.models.goal import Goal
from app.models.attendance import AttendanceSummary
from app.models.results import Result
from app.models.internal_test import InternalTest

# ── Auto-tracking rules ────────────────────────────────────────
# Each rule is a function(db) -> float
# Add new rules by adding a key here that matches Goal.metric

def _rule_attendance_overall(db):
    v=db.query(func.avg(AttendanceSummary.attendance_pct)).scalar()
    return round(v or 0,1)

def _rule_pass_pct(db):
    total=db.query(func.count()).select_from(Result).scalar() or 1
    passed=db.query(func.count()).select_from(Result).filter(Result.is_pass==True).scalar() or 0
    return round(passed/total*100,1)

def _rule_avg_cgpa(db):
    v=db.query(func.avg(Result.total_marks)).scalar()
    return round((v or 0)/10,2)

def _rule_arrear_sections(db):
    rows=db.query(Result.year,Result.section,func.sum(case((Result.has_arrear==True,1),else_=0)).label('arr'))        .group_by(Result.year,Result.section).all()
    return float(sum(1 for r in rows if r.arr==0))

def _rule_avg_internal(db):
    v=db.query(func.avg(InternalTest.marks_scored/InternalTest.max_marks*100)).scalar()
    return round(v or 0,1)

def _rule_sections_above_80att(db):
    rows=db.query(AttendanceSummary.year,AttendanceSummary.section,
        func.avg(AttendanceSummary.attendance_pct).label('avg'))        .group_by(AttendanceSummary.year,AttendanceSummary.section).all()
    return float(sum(1 for r in rows if r.avg and r.avg>80))

AUTO_RULES={
    'attendance_overall':   _rule_attendance_overall,
    'pass_pct':             _rule_pass_pct,
    'avg_cgpa':             _rule_avg_cgpa,
    'arrear_sections':      _rule_arrear_sections,
    'avg_internal':         _rule_avg_internal,
    'sections_above_80att': _rule_sections_above_80att,
}

def _compute_status(current,target):
    pct=current/target*100 if target else 0
    if pct>=100: return 'achieved'
    if pct>=75:  return 'in-progress'
    return 'at-risk'

def refresh_auto_goals(db:Session):
    goals=db.query(Goal).filter(Goal.auto_tracked==True).all()
    for g in goals:
        rule=AUTO_RULES.get(g.metric)
        if rule:
            try:
                g.current=rule(db)
                g.status=_compute_status(g.current,g.target)
            except Exception:
                pass
    db.commit()

def get_all(db:Session):
    refresh_auto_goals(db)
    return db.query(Goal).order_by(Goal.id).all()

def create(db:Session,data:dict):
    g=Goal(**data)
    db.add(g);db.commit();db.refresh(g)
    return g

def update(db:Session,goal_id:int,data:dict):
    g=db.query(Goal).filter_by(id=goal_id).first()
    if not g: return None
    for k,v in data.items():
        if hasattr(g,k): setattr(g,k,v)
    if not g.auto_tracked:
        g.status=_compute_status(g.current,g.target)
    db.commit();db.refresh(g)
    return g

def delete(db:Session,goal_id:int):
    g=db.query(Goal).filter_by(id=goal_id).first()
    if g: db.delete(g);db.commit()
    return g

def seed_defaults(db:Session):
    if db.query(Goal).count()>0: return
    defaults=[
      dict(metric='attendance_overall',label='Overall Attendance',target=85,current=78.4,unit='%',deadline='May 2025',status='at-risk',auto_tracked=True,rule='Auto: avg attendance_pct from attendance_summary'),
      dict(metric='pass_pct',label='Overall Pass %',target=90,current=81.2,unit='%',deadline='May 2025',status='at-risk',auto_tracked=True,rule='Auto: passed/total from results'),
      dict(metric='avg_cgpa',label='Average CGPA',target=7.8,current=7.34,unit='',deadline='May 2025',status='in-progress',auto_tracked=True,rule='Auto: avg total_marks/10 from results'),
      dict(metric='placement_rate',label='Placement Rate',target=85,current=78.3,unit='%',deadline='Dec 2025',status='in-progress',auto_tracked=False,rule='Manual: updated from placement upload'),
      dict(metric='arrear_sections',label='Zero-Arrear Sections',target=6,current=2,unit='',deadline='May 2025',status='at-risk',auto_tracked=True,rule='Auto: sections with arrears=0'),
      dict(metric='avg_internal',label='Avg Internal Score',target=75,current=68.4,unit='%',deadline='Apr 2025',status='in-progress',auto_tracked=True,rule='Auto: avg from internal_tests'),
      dict(metric='sections_above_80att',label='Sections Above 80% Att',target=8,current=5,unit='',deadline='Mar 2025',status='achieved',auto_tracked=True,rule='Auto: sections with avg_attendance>80'),
      dict(metric='highest_package',label='Highest Package',target=20,current=18,unit='LPA',deadline='Dec 2025',status='in-progress',auto_tracked=False,rule='Manual: updated from placement upload'),
    ]
    for d in defaults: db.add(Goal(**d))
    db.commit()
