# migrate_all_dept.py
import psycopg2
from app.core.config import settings

def migrate():
    # Example DATABASE_URL: postgresql://postgres:password@localhost:5432/vsb_apex
    # We need to convert it to a DSN string or use the parts
    db_url = settings.database_url
    print(f"Connecting to {db_url.split('@')[1]}")
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        tables = ['results', 'internal_tests', 'placement']
        
        for table in tables:
            print(f"Checking table: {table}")
            cur.execute(f"SELECT column_name FROM information_schema.columns WHERE table_name='{table}' AND column_name='department';")
            if not cur.fetchone():
                print(f"Adding 'department' column to {table}...")
                cur.execute(f"ALTER TABLE {table} ADD COLUMN department VARCHAR(50);")
                print("Done.")
            else:
                print(f"'department' already exists in {table}.")
        
        conn.commit()
        cur.close()
        conn.close()
        print("Migration completed successfully.")
        
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    migrate()
