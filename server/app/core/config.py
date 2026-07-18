# server/app/core/config.py

import sys
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "NotaMed API"

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"

    # Groq
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "llama-3.1-70b-versatile"
    GROQ_STT_MODEL: str = "whisper-large-v3"          # added

    # OpenAI
    OPENAI_API_KEY: Optional[str] = None              # added
    OPENAI_STT_MODEL: str = "whisper-1"               # added

    # AI Provider: "groq" or "openai"
    AI_PROVIDER: str = "groq"                         # added

    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Database
    DATABASE_URL: Optional[str] = None

    # Allow extra environment variables (like HOST, PORT, etc.) to be ignored
    model_config = SettingsConfigDict(
        extra='ignore',
        env_file='.env',
        env_file_encoding='utf-8'
    )

    def validate(self) -> "Settings":
        """Log warnings for missing critical keys."""
        if not self.GROQ_API_KEY:
            print(
                "⚠️  WARNING: GROQ_API_KEY is not set in environment variables!",
                file=sys.stderr,
            )
            print("   Please set GROQ_API_KEY in .env or in your deployment platform.", file=sys.stderr)
        if self.AI_PROVIDER == "openai" and not self.OPENAI_API_KEY:
            print(
                "⚠️  WARNING: AI_PROVIDER is 'openai' but OPENAI_API_KEY is not set!",
                file=sys.stderr,
            )
        return self

# Singleton instance
settings = Settings()
settings.validate()