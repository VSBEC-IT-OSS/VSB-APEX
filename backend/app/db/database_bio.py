from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

BIOMETRIC_DB_URL = settings.biometric_db_url

# Create engine safely.
bio_engine = create_engine(
    BIOMETRIC_DB_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
) if BIOMETRIC_DB_URL else None

BioSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=bio_engine) if bio_engine else None

def get_bio_db():
    if not BioSessionLocal:
        yield None
        return
    db = BioSessionLocal()
    try:
        yield db
    finally:
        db.close()
