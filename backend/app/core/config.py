from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path
from typing import List

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    app_env: str = "development"
    database_url: str
    biometric_db_url: str = ""
    secret_key: str
    access_token_expire_minutes: int = 480
    algorithm: str = "HS256"
    cors_origins: str = "http://localhost:5173"
    # Email (Gmail SMTP)
    mail_username: str = ""
    mail_password: str = ""
    mail_from: str = "VSB-APEX <noreply@gmail.com>"
    # Frontend URL (for email links)
    frontend_url: str = "http://localhost:5173"

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding='utf-8',
        case_sensitive=False,  # Allow mapping uppercase env vars to lowercase fields
        extra='ignore'         # Gracefully ignore extra env vars if any
    )

    def __init__(self, **data):
        super().__init__(**data)
        # Validate critical vars
        if self.secret_key == "dev-secret-change-in-prod":
            print("⚠️  WARNING: Using default secret_key! Set a real one in .env")
        if not self.database_url:
            raise ValueError("❌ database_url must be set in .env")

    @property
    def cors_origins_list(self) -> List[str]:
        origins = [o.strip() for o in self.cors_origins.split(",")]
        # Log for debugging
        print(f"CORS Origins: {origins}")
        return origins

settings = Settings()