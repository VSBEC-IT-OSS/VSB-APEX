# app/models/goal.py
from sqlalchemy import Column,Integer,String,Float,Boolean,DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class Goal(Base):
    __tablename__="goals"
    id           =Column(Integer,primary_key=True,index=True)
    metric       =Column(String(60),nullable=False)   # key like 'attendance_overall'
    label        =Column(String(120),nullable=False)
    target       =Column(Float,nullable=False)
    current      =Column(Float,default=0)
    unit         =Column(String(10),default='')
    deadline     =Column(String(20))
    status       =Column(String(20),default='in-progress')
    auto_tracked =Column(Boolean,default=True)
    rule         =Column(String(255))
    created_at   =Column(DateTime(timezone=True),server_default=func.now())
    updated_at   =Column(DateTime(timezone=True),onupdate=func.now(),server_default=func.now())
