from pydantic_settings import BaseSettings
from pydantic import PostgresDsn, field_validator
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "NotaMed MVP"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: PostgresDsn
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days for MVP
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    
    # Groq
    GROQ_API_KEY: str
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:3000", "https://*.vercel.app"]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()
