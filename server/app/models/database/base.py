"""
Database Base Configuration - SQLite for Vercel Serverless
Uses /tmp directory for write access on Vercel
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# Use /tmp for Vercel serverless (only writable directory)
DB_PATH = '/tmp/medivoice.db'

# Sync engine for table creation
sync_engine = create_engine(
    f"sqlite:///{DB_PATH}",
    echo=False,
    connect_args={"check_same_thread": False}
)

# Async engine for requests
async_engine = create_async_engine(
    f"sqlite+aiosqlite:///{DB_PATH}",
    echo=False,
    connect_args={"check_same_thread": False}
)

# Session makers
SyncSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sync_engine)
AsyncSessionLocal = async_sessionmaker(async_engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    """Base class for all database models"""
    pass


def init_db_sync():
    """Initialize database tables - synchronous version"""
    Base.metadata.create_all(bind=sync_engine)


async def init_db():
    """Initialize database tables"""
    init_db_sync()


async def get_db() -> AsyncSession:
    """Dependency to get database session"""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()
