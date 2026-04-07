from sqlalchemy import Column, String, Date, DateTime
from sqlalchemy.ext.declarative import declarative_base

# Use a separate declarative base so it doesn't conflict with local migrations
BioBase = declarative_base()

class AttendanceRecordBio(BioBase):
    __tablename__ = "attendance_records"

    id = Column(String, primary_key=True)
    studentId = Column(String, index=True)
    studentName = Column(String)
    rollNumber = Column(String)
    department = Column(String, index=True)
    class_name = Column("class", String, index=True)
    section = Column(String)
    date = Column(Date, index=True)
    firstPunchIn = Column(DateTime, nullable=True)
    lastPunchOut = Column(DateTime, nullable=True)
    status = Column(String, index=True)
    sourceFile = Column(String)
    importLogId = Column(String)
    importedAt = Column(DateTime)
    rawHash = Column(String)
