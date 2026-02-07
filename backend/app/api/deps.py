"""
API dependencies for FastAPI endpoints.
Provides database session and authentication dependencies.
"""
from collections.abc import Generator
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select

from app.core.config import settings
from app.core.security import decode_access_token
from app.db.session import get_session
from app.models.user import User


# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)


# Database session dependency
SessionDep = Annotated[Session, Depends(get_session)]


async def get_current_user(
    session: SessionDep,
    token: Annotated[str, Depends(oauth2_scheme)]
) -> User:
    """
    Dependency to get the current authenticated user.
    
    Args:
        session: Database session
        token: JWT token from Authorization header
        
    Returns:
        User object
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    payload = decode_access_token(token)
    if payload is None:
        raise credentials_exception
    
    user_id: str | None = payload.get("sub")
    if user_id is None:
        raise credentials_exception
    
    statement = select(User).where(User.id == user_id)
    user = session.exec(statement).first()
    
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    return user


# Authenticated user dependency
CurrentUser = Annotated[User, Depends(get_current_user)]


async def get_current_superuser(
    current_user: CurrentUser,
) -> User:
    """
    Dependency to require superuser/admin privileges.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        User object (if superuser)
        
    Raises:
        HTTPException: If user is not a superuser
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges"
        )
    return current_user


# Superuser dependency
CurrentSuperuser = Annotated[User, Depends(get_current_superuser)]
