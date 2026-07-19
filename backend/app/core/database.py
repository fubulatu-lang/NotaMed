from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from .config import settings

# Neon provides a connection string with ?sslmode=require, which asyncpg doesn't accept.
# We strip it and explicitly pass ssl=True.
DATABASE_URL = settings.DATABASE_URL.replace("?sslmode=require", "").replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    connect_args={"ssl": True}  # Required for asyncpg with Neon
)

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

# ✅ THIS LINE WAS MISSING – it defines the declarative base for all models.
Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session