"""
Application Configuration
"""
from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import validator


class Settings(BaseSettings):
    """Application settings"""
    
    APP_NAME: str = "MediVoice"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = True
    ENVIRONMENT: str = "production"
    API_PREFIX: str = "/api/v1"
    
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    CORS_ORIGINS: List[str] = ["*"]
    
    @validator("CORS_ORIGINS", pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            import json
            try:
                return json.loads(v)
            except:
                return ["*"]
        return v
    
    # Database - MUST be set in Vercel environment variables
    DATABASE_URL: str = "postgresql+asyncpg://user:pass@host/db"
    
    REDIS_URL: Optional[str] = None
    
    JWT_SECRET_KEY: str = "medivoice-secret-key-123"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    SESSION_TIMEOUT_MINUTES: int = 10
    MAX_NOTES_PER_SESSION: int = 5
    
    GROQ_API_KEY: Optional[str] = None
    GROQ_STT_MODEL: str = "whisper-large-v3"
    GROQ_LLM_MODEL: str = "llama-3.1-70b-versatile"
    
    OPENAI_API_KEY: Optional[str] = None
    AI_PROVIDER: str = "groq"
    
    ENABLE_MULTI_TEMPLATE: bool = False
    
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
