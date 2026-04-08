import sys
import os
# Add current directory to path so we can import app
sys.path.append(os.getcwd())

from app.db.database import engine
from sqlalchemy import text

def sync():
    print("🚀 Starting Database Sync...")
    with engine.connect() as conn:
        # 1. Update attendance_summary
        print("Checking attendance_summary table...")
        try:
            conn.execute(text("ALTER TABLE attendance_summary ADD COLUMN is_excess_leave BOOLEAN DEFAULT FALSE"))
            conn.commit()
            print("✅ SUCCESS: Added 'is_excess_leave' to 'attendance_summary'")
        except Exception as e:
            if "already exists" in str(e):
                print("ℹ️  INFO: 'is_excess_leave' already exists in 'attendance_summary'")
            else:
                print(f"❌ ERROR updating attendance_summary: {e}")

        # 2. Update placement
        print("Checking placement table...")
        try:
            conn.execute(text("ALTER TABLE placement ADD COLUMN department VARCHAR(50)"))
            conn.commit()
            print("✅ SUCCESS: Added 'department' to 'placement'")
        except Exception as e:
            if "already exists" in str(e):
                print("ℹ️  INFO: 'department' already exists in 'placement'")
            else:
                print(f"❌ ERROR updating placement: {e}")
        
    print("🏁 Sync Complete.")

if __name__ == "__main__":
    sync()
