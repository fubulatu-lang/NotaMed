from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from .config import settings

# Remove sslmode=require from the URL and convert to asyncpg URL
DATABASE_URL = settings.DATABASE_URL.replace("?sslmode=require", "").replace("postgresql://", "postgresql+asyncpg://")

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    pool_pre_ping=True,
    connect_args={"ssl": True}   # This is the correct way for asyncpg
)

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
