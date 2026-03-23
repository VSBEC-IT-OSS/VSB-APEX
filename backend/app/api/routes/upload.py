from fastapi import APIRouter,UploadFile,File,Depends,HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.api.deps import get_current_user
from app.utils.excel_parser import parse_attendance,parse_results,parse_internal_test,parse_placement
from app.services.attendance_service import bulk_upsert_attendance,recompute_summary
from app.services.results_service import bulk_upsert_results
from app.models.internal_test import InternalTest
from app.models.placement import Placement
import uuid

router=APIRouter(prefix="/upload",tags=["Upload"])
ALLOWED={"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-excel"}

def _chk(file):
    if file.content_type not in ALLOWED and not file.filename.endswith((".xlsx",".xls")):
        raise HTTPException(415,"Only .xlsx/.xls files accepted")

@router.post("/attendance")
async def up_attendance(file:UploadFile=File(...),db:Session=Depends(get_db),_=Depends(get_current_user)):
    _chk(file);content=await file.read()
    rows,batch_id=parse_attendance(content)
    r=bulk_upsert_attendance(db,rows);recompute_summary(db)
    return{"success":True,"rows_inserted":r["inserted"],"rows_skipped":r["skipped"],"batch_id":batch_id,"message":f"Attendance uploaded. {r['inserted']} new records."}

@router.post("/results")
async def up_results(file:UploadFile=File(...),db:Session=Depends(get_db),_=Depends(get_current_user)):
    _chk(file);content=await file.read()
    rows,batch_id=parse_results(content)
    r=bulk_upsert_results(db,rows)
    return{"success":True,"rows_inserted":r["inserted"],"rows_skipped":r["skipped"],"batch_id":batch_id,"message":f"Results uploaded. {r['inserted']} records."}

@router.post("/internal")
async def up_internal(file:UploadFile=File(...),db:Session=Depends(get_db),_=Depends(get_current_user)):
    _chk(file);content=await file.read()
    rows,batch_id=parse_internal_test(content)
    ins=skp=0
    for row in rows:
        ex=db.query(InternalTest).filter_by(student_id=row["student_id"],subject_code=row["subject_code"],test_number=row["test_number"]).first()
        if ex: skp+=1; continue
        row.pop('upload_batch', None)
        db.add(InternalTest(**row));ins+=1
    db.commit()
    return{"success":True,"rows_inserted":ins,"rows_skipped":skp,"batch_id":batch_id,"message":f"Internal test data uploaded. {ins} records."}

@router.post("/placement")
async def up_placement(file:UploadFile=File(...),db:Session=Depends(get_db),_=Depends(get_current_user)):
    _chk(file);content=await file.read()
    rows,batch_id=parse_placement(content)
    ins=skp=0
    for row in rows:
        ex=db.query(Placement).filter_by(student_id=row["student_id"],company=row["company"]).first()
        if ex: skp+=1; continue
        db.add(Placement(**row));ins+=1
    db.commit()
    return{"success":True,"rows_inserted":ins,"rows_skipped":skp,"batch_id":batch_id,"message":f"Placement data uploaded. {ins} records."}
