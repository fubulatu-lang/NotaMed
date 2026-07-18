# backend/app/core/config.py
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "NotaMed MVP"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    
    DATABASE_URL: str  # Neon gives postgresql://, we parse to asyncpg later
    
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    GROQ_API_KEY: str
    
    # IMPORTANT: Add your production Vercel URL here + localhost
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://your-app-name.vercel.app",  # <-- CHANGE THIS TO YOUR VERCEL PRODUCTION URL
        # If you have preview deployments, you can dynamically allow them via regex,
        # but for MVP, just add the specific ones or use "*" (not recommended for prod).
    ]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

settings = Settings()
