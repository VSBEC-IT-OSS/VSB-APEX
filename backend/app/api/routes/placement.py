from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.deps import get_current_user

router = APIRouter(prefix="/placement", tags=["Placement"])

# Placeholder — wire to a Placement model when Phase 2 data is ready
@router.get("/stats")
def stats(_=Depends(get_current_user)):
    return {
        "eligible": 120,
        "placed": 94,
        "placementPct": 78.3,
        "avgPackage": 5.4,
        "highestPackage": 18,
        "companies": 22,
    }
