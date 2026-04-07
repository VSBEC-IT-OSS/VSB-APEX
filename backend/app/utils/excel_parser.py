# app/utils/excel_parser.py
import pandas as pd,uuid
from io import BytesIO
from typing import List,Dict,Tuple
from fastapi import HTTPException

def _read(file_bytes:bytes)->pd.ExcelFile:
    try: return pd.ExcelFile(BytesIO(file_bytes))
    except Exception as e: raise HTTPException(400,f"Cannot read Excel: {e}")

def parse_attendance(file_bytes:bytes)->Tuple[List[Dict],str]:
    xl=_read(file_bytes);df=xl.parse(xl.sheet_names[0])
    req={"Student_ID","Department","Year","Section","Date"}
    miss=req-set(df.columns)
    if miss: raise HTTPException(422,f"Missing columns: {miss}")
    df=df.dropna(subset=["Student_ID","Date"])
    batch_id=str(uuid.uuid4())[:8]
    rows=[{"student_id":str(r["Student_ID"]).strip(),"student_name":str(r.get("Student_Name","")).strip(),
      "department":str(r["Department"]).strip(),"year":str(r["Year"]).strip(),"section":str(r["Section"]).strip(),
      "subject_code":str(r.get("Subject_Code","GENERAL")).strip(),"subject_name":str(r.get("Subject_Name","General Attendance")).strip(),
      "date":pd.to_datetime(r["Date"]).date(),"status":"present","upload_batch":batch_id}
     for _,r in df.iterrows()]
    return rows,batch_id

def parse_results(file_bytes:bytes)->Tuple[List[Dict],str]:
    xl=_read(file_bytes);df=xl.parse(xl.sheet_names[0])
    req={"Student_ID","Department","Year","Section","Semester","Subject_Code","Total_Marks"}
    miss=req-set(df.columns)
    if miss: raise HTTPException(422,f"Missing columns: {miss}")
    df=df.dropna(subset=["Student_ID","Subject_Code"])
    batch_id=str(uuid.uuid4())[:8]
    rows=[]
    for _,r in df.iterrows():
        total=float(r.get("Total_Marks",0))
        # is_pass is optional, default to total >= 50
        ip_val = r.get("Is_Pass")
        is_pass = bool(ip_val) if pd.notna(ip_val) else total >= 50
        rows.append({"student_id":str(r["Student_ID"]).strip(),"student_name":str(r.get("Student_Name","")).strip(),
          "department":str(r["Department"]).strip(),"year":str(r["Year"]).strip(),"section":str(r["Section"]).strip(),"semester":int(r["Semester"]),
          "subject_code":str(r["Subject_Code"]).strip(),"subject_name":str(r.get("Subject_Name","")).strip(),
          "internal_marks":float(r.get("Internal_Marks",0)),"external_marks":float(r.get("External_Marks",0)),
          "total_marks":total,"grade":str(r.get("Grade","")).strip(),"is_pass":is_pass,"has_arrear":not is_pass,"upload_batch":batch_id})
    return rows,batch_id

def parse_internal_test(file_bytes:bytes)->Tuple[List[Dict],str]:
    xl=_read(file_bytes);df=xl.parse(xl.sheet_names[0])
    req={"Student_ID","Department","Year","Section","Subject_Code","Test_Number","Marks_Scored"}
    miss=req-set(df.columns)
    if miss: raise HTTPException(422,f"Missing columns: {miss}")
    df=df.dropna(subset=["Student_ID","Subject_Code"])
    batch_id=str(uuid.uuid4())[:8]
    rows=[{"student_id":str(r["Student_ID"]).strip(),"student_name":str(r.get("Student_Name","")).strip(),
      "department":str(r["Department"]).strip(),"year":str(r["Year"]).strip(),"section":str(r["Section"]).strip(),
      "subject_code":str(r["Subject_Code"]).strip(),"subject_name":str(r.get("Subject_Name","")).strip(),
      "test_number":int(r["Test_Number"]),"max_marks":float(r.get("Max_Marks",50)),"marks_scored":float(r["Marks_Scored"]),"upload_batch":batch_id}
     for _,r in df.iterrows()]
    return rows,batch_id

def parse_placement(file_bytes:bytes)->Tuple[List[Dict],str]:
    xl=_read(file_bytes);df=xl.parse(xl.sheet_names[0])
    req={"Student_ID","Department","Year","Section","Company","Package_LPA"}
    miss=req-set(df.columns)
    if miss: raise HTTPException(422,f"Missing columns: {miss}")
    df=df.dropna(subset=["Student_ID","Company"])
    batch_id=str(uuid.uuid4())[:8]
    rows=[{"student_id":str(r["Student_ID"]).strip(),"student_name":str(r.get("Student_Name","")).strip(),
      "department":str(r["Department"]).strip(),"year":str(r["Year"]).strip(),"section":str(r["Section"]).strip(),
      "company":str(r["Company"]).strip(),"package_lpa":float(r.get("Package_LPA",0)),
      "offer_type":str(r.get("Offer_Type","IT")).strip(),"batch":str(r.get("Batch","")).strip(),"upload_batch":batch_id}
     for _,r in df.iterrows()]
    return rows,batch_id
