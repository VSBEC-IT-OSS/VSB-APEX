from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.db.database import get_db
from app.api.deps import get_current_user
from app.services.insights_service import get_insights

router = APIRouter(prefix="/insights", tags=["Insights"])

@router.get("")
def insights(db: Session = Depends(get_db), _=Depends(get_current_user)):
    data = get_insights(db)
    return {"insights": data, "generated_at": datetime.utcnow().isoformat()}
