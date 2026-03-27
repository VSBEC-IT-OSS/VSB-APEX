# app/api/routes/goals.py
from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.deps import get_current_user
from app.services import goals_service as svc
from pydantic import BaseModel
from typing import Optional

router=APIRouter(prefix="/goals",tags=["Goals"])

class GoalIn(BaseModel):
    metric:str
    label:str
    target:float
    current:float=0
    unit:str=''
    deadline:str=''
    status:str='in-progress'
    auto_tracked:bool=True
    rule:str=''

class GoalPatch(BaseModel):
    label:Optional[str]=None
    target:Optional[float]=None
    current:Optional[float]=None
    unit:Optional[str]=None
    deadline:Optional[str]=None
    status:Optional[str]=None
    auto_tracked:Optional[bool]=None
    rule:Optional[str]=None

def _fmt(g):
    return{
        'id':g.id,'metric':g.metric,'label':g.label,
        'target':g.target,'current':g.current,'unit':g.unit,
        'deadline':g.deadline,'status':g.status,
        'autoTracked':g.auto_tracked,'rule':g.rule,
    }

@router.get("")
def list_goals(db:Session=Depends(get_db),_=Depends(get_current_user)):
    svc.seed_defaults(db)
    return[_fmt(g) for g in svc.get_all(db)]

@router.post("",status_code=201)
def create_goal(data:GoalIn,db:Session=Depends(get_db),_=Depends(get_current_user)):
    g=svc.create(db,data.model_dump())
    return _fmt(g)

@router.patch("/{goal_id}")
def patch_goal(goal_id:int,data:GoalPatch,db:Session=Depends(get_db),_=Depends(get_current_user)):
    g=svc.update(db,goal_id,{k:v for k,v in data.model_dump().items() if v is not None})
    if not g: raise HTTPException(404,"Goal not found")
    return _fmt(g)

@router.delete("/{goal_id}",status_code=204)
def delete_goal(goal_id:int,db:Session=Depends(get_db),_=Depends(get_current_user)):
    if not svc.delete(db,goal_id): raise HTTPException(404,"Goal not found")

@router.post("/refresh")
def refresh(db:Session=Depends(get_db),_=Depends(get_current_user)):
    svc.refresh_auto_goals(db)
    return{"message":"Auto-tracked goals refreshed"}
