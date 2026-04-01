# app/api/routes/placement.py
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.db.database import get_db
from app.api.deps import get_current_user
from app.models.placement import Placement
from app.utils.excel_parser import parse_placement
from app.db.database import SessionLocal

router = APIRouter(prefix="/placement", tags=["Placement"])

@router.get("/stats")
def stats(_=Depends(get_current_user), db: Session = Depends(get_db)):
    """Get overall placement statistics"""
    placements = db.query(Placement).all()
    if not placements:
        return {"eligible": 0, "placed": 0, "placementPct": 0, "avgPackage": 0, "highestPackage": 0, "companies": 0}
    
    placed_count = len(placements)
    avg_pkg = db.query(func.avg(Placement.package_lpa)).scalar() or 0
    max_pkg = db.query(func.max(Placement.package_lpa)).scalar() or 0
    companies_count = db.query(Placement.company).distinct().count()
    
    return {
        "eligible": placed_count + 20,
        "placed": placed_count,
        "placementPct": round((placed_count / (placed_count + 20)) * 100, 1),
        "avgPackage": round(avg_pkg, 2),
        "highestPackage": round(max_pkg, 2),
        "companies": companies_count,
    }

@router.get("/rows")
def rows(_=Depends(get_current_user), db: Session = Depends(get_db)):
    """Get raw placement rows"""
    placements = db.query(Placement).all()
    return [
        {
            "student_id": p.student_id,
            "student_name": p.student_name,
            "year": p.year,
            "section": p.section,
            "batch": p.batch,
            "company": p.company,
            "package": p.package_lpa,
            "offer_type": p.offer_type,
            "upload_batch": p.upload_batch,
            "uploaded_at": p.uploaded_at.isoformat() if p.uploaded_at else None,
        }
        for p in placements
    ]

@router.post("/upload")
async def upload_placement(file: UploadFile = File(...), _=Depends(get_current_user)):
    """Upload placement data from Excel"""
    try:
        file_bytes = await file.read()
        rows, batch_id = parse_placement(file_bytes)
        
        db = SessionLocal()
        inserted = 0
        skipped = 0
        
        for row in rows:
            try:
                existing = db.query(Placement).filter(
                    Placement.student_id == row["student_id"],
                    Placement.company == row["company"]
                ).first()
                
                if not existing:
                    placement = Placement(**row)
                    db.add(placement)
                    inserted += 1
                else:
                    skipped += 1
            except Exception as e:
                skipped += 1
                db.rollback()
        
        db.commit()
        db.close()
        
        return {
            "status": "success",
            "batch_id": batch_id,
            "rows_inserted": inserted,
            "rows_skipped": skipped,
            "total": len(rows)
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}, 400

@router.get("/by-batch")
def by_batch(batch: str = None, _=Depends(get_current_user), db: Session = Depends(get_db)):
    """Get placement stats grouped by batch"""
    query = db.query(Placement)
    if batch:
        query = query.filter(Placement.batch == batch)
    
    placements = query.all()
    batches = set(p.batch for p in placements if p.batch)
    
    result = []
    for b in batches:
        batch_placements = [p for p in placements if p.batch == b]
        placed_count = len(batch_placements)
        avg_pkg = sum(p.package_lpa for p in batch_placements) / len(batch_placements) if batch_placements else 0
        result.append({"batch": b, "placed": placed_count, "avgPackage": round(avg_pkg, 2)})
    
    return result

@router.get("/by-section")
def by_section(section: str = None, _=Depends(get_current_user), db: Session = Depends(get_db)):
    """Get placement stats grouped by section"""
    query = db.query(Placement)
    if section:
        query = query.filter(Placement.section == section)
    
    placements = query.all()
    sections = set(p.section for p in placements if p.section)
    
    result = []
    for s in sections:
        section_placements = [p for p in placements if p.section == s]
        placed_count = len(section_placements)
        avg_pkg = sum(p.package_lpa for p in section_placements) / len(section_placements) if section_placements else 0
        result.append({"section": s, "placed": placed_count, "avgPackage": round(avg_pkg, 2)})
    
    return result

@router.get("/by-company")
def by_company(_=Depends(get_current_user), db: Session = Depends(get_db)):
    """Get placement stats grouped by company"""
    placements = db.query(Placement).all()
    companies = {}
    
    for p in placements:
        if p.company not in companies:
            companies[p.company] = {"students": 0, "package": 0, "count": 0}
        companies[p.company]["students"] += 1
        companies[p.company]["package"] += p.package_lpa
        companies[p.company]["count"] += 1
    
    result = []
    for company, data in companies.items():
        avg_pkg = data["package"] / data["count"] if data["count"] > 0 else 0
        result.append({"company": company, "students": data["students"], "avgPackage": round(avg_pkg, 2)})
    
    return sorted(result, key=lambda x: x["avgPackage"], reverse=True)

@router.get("/batch/{batch}/section/{section}")
def batch_section(batch: str, section: str, _=Depends(get_current_user), db: Session = Depends(get_db)):
    """Get placement stats for specific batch and section"""
    placements = db.query(Placement).filter(
        Placement.batch == batch,
        Placement.section == section
    ).all()
    
    if not placements:
        return {"batch": batch, "section": section, "placed": 0, "avgPackage": 0, "companies": []}
    
    placed_count = len(placements)
    avg_pkg = sum(p.package_lpa for p in placements) / len(placements)
    companies = list(set(p.company for p in placements))
    
    return {
        "batch": batch,
        "section": section,
        "placed": placed_count,
        "avgPackage": round(avg_pkg, 2),
        "companies": companies,
    }