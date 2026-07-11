"""
Authentication Endpoints
"""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import structlog

from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token, verify_token
from app.core.config import settings
from app.models.database.base import get_db
from app.models.database.user_table import User
from app.models.domain.user import UserCreate, UserLogin, UserResponse, TokenResponse, TokenRefresh
from app.api.deps import get_current_user, get_required_user

logger = structlog.get_logger()
router = APIRouter()


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    """Register a new user"""
    try:
        # Check existing
        result = await db.execute(select(User).where(User.email == user_data.email))
        if result.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Create user
        user = User(
            email=user_data.email,
            hashed_password=get_password_hash(user_data.password),
            full_name=user_data.full_name,
            is_active=True,
            created_at=datetime.utcnow(),
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
        return {
            "email": user.email,
            "full_name": user.full_name,
            "id": user.id,
            "is_active": user.is_active,
            "is_verified": user.is_verified,
            "created_at": str(user.created_at),
            "last_login": None,
        }
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        logger.error("Registration failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/login")
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    """Login"""
    try:
        result = await db.execute(select(User).where(User.email == credentials.email))
        user = result.scalar_one_or_none()
        
        if not user or not verify_password(credentials.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        user.last_login = datetime.utcnow()
        await db.commit()
        
        access_token = create_access_token(data={"sub": str(user.id)})
        refresh_token = create_refresh_token(data={"sub": str(user.id)})
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        }
    except HTTPException:
        raise
    except Exception as e:
        await db.rollback()
        logger.error("Login failed", error=str(e))
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/refresh")
async def refresh_token(token_data: TokenRefresh):
    """Refresh token"""
    payload = verify_token(token_data.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    user_id = payload.get("sub")
    return {
        "access_token": create_access_token(data={"sub": user_id}),
        "refresh_token": create_refresh_token(data={"sub": user_id}),
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }


@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_required_user)):
    """Get current user"""
    return {
        "email": current_user.email,
        "full_name": current_user.full_name,
        "id": current_user.id,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified,
        "created_at": str(current_user.created_at),
        "last_login": str(current_user.last_login) if current_user.last_login else None,
    }
