"""
Seed comprehensive internal test data for all departments, years, semesters, and sections.
Run: python seed_internal_tests_comprehensive.py
"""
import random
from datetime import datetime, timedelta
from app.db.database import SessionLocal, engine, Base
from app.models.internal_test import InternalTest

# Ensure tables exist
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Configuration
DEPARTMENTS = ["IT", "CSE", "ECE", "EEE", "MECH", "CIVIL", "CHEMICAL", "BIOTECH", "BME", "AIML [CSE]", "AI & DS", "CCE", "CSBS"]
YEARS = ["I Year", "II Year", "III Year", "IV Year"]
SECTIONS = ["A", "B", "C", "D", "E", "F"]
TESTS = [1, 2, 3]

# Semester mapping
SEMESTERS_BY_YEAR = {
    "I Year": [1, 2],
    "II Year": [1, 2, 3, 4],
    "III Year": [1, 2, 3, 4, 5, 6],
    "IV Year": [1, 2, 3, 4, 5, 6, 7, 8],
}

# Sample subjects per semester
SUBJECTS_BY_SEMESTER = {
    1: [
        ("CS101", "Programming Fundamentals"),
        ("CS102", "Digital Logic Design"),
        ("CS103", "Mathematics I"),
        ("CS104", "Physics I"),
    ],
    2: [
        ("CS201", "Data Structures"),
        ("CS202", "Computer Architecture"),
        ("CS203", "Mathematics II"),
        ("CS204", "Physics II"),
    ],
    3: [
        ("CS301", "Algorithms"),
        ("CS302", "Database Systems"),
        ("CS303", "Operating Systems"),
        ("CS304", "Web Technologies"),
    ],
    4: [
        ("CS401", "Software Engineering"),
        ("CS402", "Computer Networks"),
        ("CS403", "Compiler Design"),
        ("CS404", "Artificial Intelligence"),
    ],
    5: [
        ("CS501", "Machine Learning"),
        ("CS502", "Cloud Computing"),
        ("CS503", "Cybersecurity"),
        ("CS504", "Big Data Analytics"),
    ],
    6: [
        ("CS601", "Advanced Algorithms"),
        ("CS602", "Distributed Systems"),
        ("CS603", "Mobile Computing"),
        ("CS604", "IoT Systems"),
    ],
    7: [
        ("CS701", "Blockchain Technology"),
        ("CS702", "Quantum Computing"),
        ("CS703", "Advanced Networking"),
        ("CS704", "Embedded Systems"),
    ],
    8: [
        ("CS801", "Project Management"),
        ("CS802", "Professional Ethics"),
        ("CS803", "Capstone Project I"),
        ("CS804", "Capstone Project II"),
    ],
}

def generate_marks(pass_rate=0.7):
    """Generate realistic test marks with some variation"""
    if random.random() < pass_rate:
        # Pass: 25-50 marks
        return round(random.uniform(25, 50), 1)
    else:
        # Fail: 0-24 marks
        return round(random.uniform(0, 24), 1)

def seed_data():
    """Seed comprehensive internal test data"""
    
    # Clear existing data
    db.query(InternalTest).delete()
    db.commit()
    
    records_created = 0
    year_codes = {"I Year": "1", "II Year": "2", "III Year": "3", "IV Year": "4"}
    
    for dept in DEPARTMENTS:
        for year in YEARS:
            semesters = SEMESTERS_BY_YEAR[year]
            year_code = year_codes[year]
            
            for semester in semesters:
                # Get subjects for this semester
                subjects = SUBJECTS_BY_SEMESTER.get(semester, [])
                if not subjects:
                    continue
                
                for section in SECTIONS:
                    # Generate 30-40 students per section
                    num_students = random.randint(30, 40)
                    
                    for student_num in range(1, num_students + 1):
                        # Create unique student ID: DEPT + YEAR_CODE + SECTION + STUDENT_NUM
                        student_id = f"{dept[:3].upper()}{year_code}{section}{student_num:03d}"
                        student_name = f"Student {student_num} {section}"
                        
                        # For each subject
                        for subject_code, subject_name in subjects:
                            # For each test
                            for test_num in TESTS:
                                # Vary pass rate by subject (some subjects harder than others)
                                subject_pass_rate = random.uniform(0.5, 0.85)
                                marks = generate_marks(subject_pass_rate)
                                
                                record = InternalTest(
                                    student_id=student_id,
                                    student_name=student_name,
                                    year=year,
                                    department=dept,
                                    section=section,
                                    semester=semester,
                                    subject_code=subject_code,
                                    subject_name=subject_name,
                                    test_number=test_num,
                                    max_marks=50,
                                    marks_scored=marks,
                                    uploaded_at=datetime.utcnow() - timedelta(days=random.randint(1, 30))
                                )
                                db.add(record)
                                records_created += 1
                                
                                # Batch commit every 1000 records
                                if records_created % 1000 == 0:
                                    db.commit()
                                    print(f"✓ Created {records_created} records...")
    
    db.commit()
    print(f"\n✅ Successfully seeded {records_created} internal test records!")
    print(f"   - Departments: {len(DEPARTMENTS)}")
    print(f"   - Years: {len(YEARS)}")
    print(f"   - Sections: {len(SECTIONS)}")
    print(f"   - Tests per subject: {len(TESTS)}")
    print(f"   - Total records: {records_created}")

if __name__ == "__main__":
    try:
        seed_data()
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()
