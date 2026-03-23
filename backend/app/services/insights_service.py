"""
Rule-based insights engine.
Each rule inspects the DB and returns Insight dicts if triggered.
Add new rules by appending to RULES list.
"""
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List, Dict
from app.models.attendance import AttendanceSummary
from app.models.results import Result
from sqlalchemy import func, case

_id = 0
def _next_id():
    global _id; _id += 1; return _id


def _att_section_rules(db: Session) -> List[Dict]:
    insights = []
    rows = db.query(
        AttendanceSummary.year, AttendanceSummary.section,
        func.avg(AttendanceSummary.attendance_pct).label("avg"),
        func.sum(case((AttendanceSummary.is_below_75 == True, 1), else_=0)).label("below75"),
        func.count(func.distinct(AttendanceSummary.student_id)).label("students"),
    ).group_by(AttendanceSummary.year, AttendanceSummary.section).all()

    for r in rows:
        sec = f"{r.year.replace(' Year','')}-{r.section}"
        avg = round(r.avg, 1)
        below = int(r.below75)

        if avg < 70:
            insights.append({"id": _next_id(), "severity": "critical", "category": "Attendance",
                "title": f"{r.year} {r.section} Section — Critical Attendance Drop",
                "detail": f"Average attendance is {avg}%, with {below} students below 75%. Immediate intervention required before exam eligibility is affected.",
                "affected": below, "section": sec, "metric": f"{avg}%"})
        elif avg < 75:
            insights.append({"id": _next_id(), "severity": "warning", "category": "Attendance",
                "title": f"{r.year} {r.section} Section — Attendance Below Threshold",
                "detail": f"Average attendance is {avg}%. {below} students are at risk of losing exam eligibility.",
                "affected": below, "section": sec, "metric": f"{avg}%"})
        elif avg >= 85:
            insights.append({"id": _next_id(), "severity": "info", "category": "Attendance",
                "title": f"{r.year} {r.section} — Strong Attendance",
                "detail": f"Section maintains {avg}% average attendance. Continue current engagement strategies.",
                "affected": 0, "section": sec, "metric": f"{avg}%"})
    return insights


def _results_rules(db: Session) -> List[Dict]:
    insights = []

    # Subject-wise
    subj_rows = db.query(
        Result.subject_code, Result.subject_name,
        func.count().label("total"),
        func.sum(case((Result.is_pass == True, 1), else_=0)).label("passed"),
        func.sum(case((Result.has_arrear == True, 1), else_=0)).label("arrears"),
    ).group_by(Result.subject_code, Result.subject_name).all()

    for r in subj_rows:
        if not r.total: continue
        pass_pct = round(r.passed / r.total * 100, 1)
        if pass_pct < 60:
            insights.append({"id": _next_id(), "severity": "critical", "category": "Results",
                "title": f"{r.subject_name or r.subject_code} — High Failure Rate",
                "detail": f"{int(r.arrears)} students have arrears. Pass rate is {pass_pct}%, the lowest across subjects.",
                "affected": int(r.arrears), "section": "All", "metric": f"{pass_pct}% pass"})
        elif pass_pct < 75:
            insights.append({"id": _next_id(), "severity": "warning", "category": "Results",
                "title": f"{r.subject_name or r.subject_code} — Below Average Pass Rate",
                "detail": f"Pass rate is {pass_pct}%. Targeted remedial sessions recommended.",
                "affected": int(r.arrears), "section": "All", "metric": f"{pass_pct}% pass"})

    # Section-wise
    sec_rows = db.query(
        Result.year, Result.section,
        func.count().label("total"),
        func.sum(case((Result.is_pass == True, 1), else_=0)).label("passed"),
        func.sum(case((Result.has_arrear == True, 1), else_=0)).label("arrears"),
    ).group_by(Result.year, Result.section).all()

    for r in sec_rows:
        if not r.total: continue
        pass_pct = round(r.passed / r.total * 100, 1)
        sec = f"{r.year.replace(' Year','')}-{r.section}"
        if pass_pct < 70:
            insights.append({"id": _next_id(), "severity": "warning", "category": "Results",
                "title": f"{r.year} {r.section} — Academic Performance Concern",
                "detail": f"Pass percentage is {pass_pct}%. Section needs targeted remedial sessions.",
                "affected": int(r.arrears), "section": sec, "metric": f"{pass_pct}% pass"})

    return insights


def get_insights(db: Session) -> List[Dict]:
    global _id; _id = 0   # reset counter each call
    insights = []
    try:
        insights += _att_section_rules(db)
        insights += _results_rules(db)
    except Exception:
        pass  # return empty list if tables are empty
    return insights
