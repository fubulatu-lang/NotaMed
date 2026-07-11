"""
Main FastAPI Application - Cloud Version
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import setup_logging
from app.api.v1.router import api_router
from app.middleware.session_cleanup import SessionCleanupMiddleware

logger = setup_logging()


async def create_admin_user():
    """Auto-create system admin on startup"""
    from app.models.database.base import init_db_sync, SyncSessionLocal
    from app.models.database.user_table import User
    from app.core.security import get_password_hash
    
    # Initialize tables first
    init_db_sync()
    
    # Check if admin exists
    db = SyncSessionLocal()
    try:
        from sqlalchemy import select
        result = db.execute(select(User).where(User.email == "sysadmin@medivoice.com"))
        admin = result.scalar_one_or_none()
        
        if not admin:
            admin = User(
                email="sysadmin@medivoice.com",
                hashed_password=get_password_hash("asdf1234"),
                full_name="System Administrator",
                is_active=True,
                is_verified=True,
            )
            db.add(admin)
            db.commit()
            logger.info("Admin user created")
        else:
            logger.info("Admin user already exists")
    except Exception as e:
        db.rollback()
        logger.error("Admin creation failed", error=str(e))
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    logger.info("Starting MediVoice API")
    
    # Create admin user on startup
    await create_admin_user()
    
    yield
    
    logger.info("Shutting down MediVoice API")


def create_app() -> FastAPI:
    """Create and configure the FastAPI application"""
    
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description="Clinical Voice-to-Text Notes API",
        docs_url="/docs",
        lifespan=lifespan,
    )
    
    # CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Session cleanup
    app.add_middleware(SessionCleanupMiddleware)
    
    # API routes
    app.include_router(api_router, prefix=settings.API_PREFIX)
    
    @app.get("/health")
    async def health_check():
        return {
            "status": "healthy",
            "version": settings.APP_VERSION,
            "database": "connected"
        }
    
    @app.get("/")
    async def root():
        return {"message": "MediVoice API", "docs": "/docs"}
    
    return app


app = create_app()
