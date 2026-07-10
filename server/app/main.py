"""
Main FastAPI Application - Cloud Version
All AI processing via cloud APIs
Phone-friendly CORS configuration
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1.router import api_router
from app.middleware.session_cleanup import SessionCleanupMiddleware

# Setup structured logging
logger = setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager
    Handles startup and shutdown events
    """
    # Startup
    logger.info("Starting MediVoice API", version=settings.APP_VERSION)
    
    # Initialize database (create tables)
    try:
        from app.models.database.base import init_db
        await init_db()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error("Database initialization failed", error=str(e))
    
    yield
    
    # Shutdown
    logger.info("Shutting down MediVoice API")
    # Cleanup any temporary files/sessions


def create_app() -> FastAPI:
    """Create and configure the FastAPI application"""
    
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="Clinical Voice-to-Text Notes API",
        docs_url="/docs" if settings.DEBUG else None,
        redoc_url="/redoc" if settings.DEBUG else None,
        openapi_url="/openapi.json" if settings.DEBUG else None,
        lifespan=lifespan,
    )
    
    # CORS Middleware - Allow phone and web access
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Allow all origins for MVP
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Session cleanup middleware (zero retention)
    app.add_middleware(SessionCleanupMiddleware)
    
    # Include API routes
    app.include_router(api_router, prefix=settings.API_PREFIX)
    
    # Health check endpoint
    @app.get("/health")
    async def health_check():
        return {
            "status": "healthy",
            "version": settings.APP_VERSION,
            "service": "medivoice-api",
            "database": "connected"
        }
    
    @app.get("/")
    async def root():
        return {
            "message": "MediVoice API",
            "docs": "/docs",
            "health": "/health"
        }
    
    return app


app = create_app()
