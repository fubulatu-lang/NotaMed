# server/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import formatting, health
from app.core.config import settings

# Import database models to register them with SQLAlchemy
import app.models.database

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Configure CORS
def get_cors_origins() -> list[str]:
    origins = []
    for origin in settings.CORS_ORIGINS.split(","):
        origin = origin.strip()
        if origin:
            origins.append(origin)
    if settings.ENVIRONMENT == "development" and settings.DEBUG:
        origins.append("*")
    seen = set()
    unique_origins = []
    for origin in origins:
        if origin not in seen:
            seen.add(origin)
            unique_origins.append(origin)
    return unique_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix=settings.API_V1_STR, tags=["health"])
app.include_router(formatting.router, prefix=settings.API_V1_STR, tags=["formatting"])

@app.get("/")
async def root():
    return {"message": "NotaMed API is running", "environment": settings.ENVIRONMENT}