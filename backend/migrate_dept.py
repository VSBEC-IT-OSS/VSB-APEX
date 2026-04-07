from sqlalchemy import create_engine, text
from app.core.config import settings

def migrate():
    engine = create_engine(settings.database_url)
    with engine.connect() as conn:
        print("Checking tables...")
        for table in ['attendance_records', 'attendance_summary']:
            try:
                # PostgreSQL specific check/add
                conn.execute(text(f"ALTER TABLE {table} ADD COLUMN IF NOT EXISTS department VARCHAR(50)"))
                print(f"Added 'department' column to '{table}' (or already exists)")
            except Exception as e:
                print(f"Error updating '{table}': {e}")
        conn.commit()

if __name__ == "__main__":
    migrate()
