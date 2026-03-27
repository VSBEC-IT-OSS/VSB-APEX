# seed_users.py
"""
Seed initial users into database.
Run once: python seed_users.py
"""
from app.db.database import SessionLocal, engine, Base
from app.models.user import User
from app.core.security import hash_password

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Check if users exist
if db.query(User).count() == 0:
    users = [
        User(
            name="Dr. S. Ramesh",
            email="hod@vsbec.edu.in",
            password=hash_password("admin123"),
            role="hod",
            is_active=True
        ),
        User(
            name="Staff Member 1",
            email="staff1@vsbec.edu.in",
            password=hash_password("staff123"),
            role="staff",
            is_active=True
        ),
        User(
            name="Admin",
            email="admin@vsbec.edu.in",
            password=hash_password("admin123"),
            role="admin",
            is_active=True
        ),
    ]
    db.add_all(users)
    db.commit()
    print("✅ Seeded 3 test users")
else:
    print(f"ℹ️  {db.query(User).count()} users already exist")

db.close()