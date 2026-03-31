# app/models/placement.py
from sqlalchemy import Column,Integer,String,Float,DateTime,UniqueConstraint
from sqlalchemy.sql import func
from app.db.database import Base

class Placement(Base):
    __tablename__="placement"
    __table_args__=(UniqueConstraint("student_id","company",name="uq_placement"),)
    id           =Column(Integer,primary_key=True,index=True)
    student_id   =Column(String(20),index=True,nullable=False)
    student_name =Column(String(100))
    year         =Column(String(20))
    section      =Column(String(5),index=True)
    batch        =Column(String(20),index=True)
    company      =Column(String(120),nullable=False)
    package_lpa  =Column(Float,default=0)
    offer_type   =Column(String(30),default='IT')
    upload_batch =Column(String(50))
    uploaded_at  =Column(DateTime(timezone=True),server_default=func.now())