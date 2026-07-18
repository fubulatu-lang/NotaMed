# server/app/core/config.py

import os
import sys
from typing import List, Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "NotaMed API"

    # CORS - read from env, comma-separated, default to localhost
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000"

    # Groq
    GROQ_API_KEY: Optional[str] = None
    GROQ_MODEL: str = "llama-3.1-70b-versatile"

    # Environment
    ENVIRONMENT: str = "development"  # or "production"
    DEBUG: bool = True

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

    def validate(self) -> "Settings":
        """Verify required environment variables and log warnings."""
        if not self.GROQ_API_KEY:
            print(
                "⚠️  WARNING: GROQ_API_KEY is not set in environment variables!",
                file=sys.stderr,
            )
            print("   Please set GROQ_API_KEY in .env or in your deployment platform.", file=sys.stderr)
            # In production, we might want to raise an error:
            # if self.ENVIRONMENT == "production":
            #     raise ValueError("GROQ_API_KEY is required in production")
        return self


# Singleton instance
settings = Settings()
settings.validate()
