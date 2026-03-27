# app/core/config.py
from pydantic_settings import BaseSettings
from pathlib import Path
from typing import List

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    APP_ENV: str = "development"
    DATABASE_URL: str
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    ALGORITHM: str = "HS256"
    CORS_ORIGINS: str = "http://localhost:5173"

    def __init__(self, **data):
        super().__init__(**data)
        # Validate critical vars
        if self.SECRET_KEY == "dev-secret-change-in-prod":
            print("⚠️  WARNING: Using default SECRET_KEY! Set a real one in .env")
        if not self.DATABASE_URL:
            raise ValueError("❌ DATABASE_URL must be set in .env")

    @property
    def cors_origins_list(self) -> List[str]:
        origins = [o.strip() for o in self.CORS_ORIGINS.split(",")]
        # Log for debugging
        print(f"CORS Origins: {origins}")
        return origins

    class Config:
        env_file = BASE_DIR / ".env"

settings = Settings()