"""
Authentication endpoints.
Handles user login and token generation.
"""
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from app.api.deps import CurrentUser, SessionDep
from app.core.security import create_access_token, verify_password
from app.models.user import Token, User, UserPublic


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=Token)
async def login(
    session: SessionDep,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:
    """
    OAuth2 compatible token login.
    
    Args:
        session: Database session
        form_data: OAuth2 form with username (email) and password
        
    Returns:
        JWT access token
        
    Raises:
        HTTPException: If credentials are invalid
    """
    # Find user by email (username field contains email)
    statement = select(User).where(User.email == form_data.username)
    user = session.exec(statement).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    # Create access token
    access_token = create_access_token(subject=str(user.id))
    
    return Token(access_token=access_token, token_type="bearer")


@router.post("/test-token")
async def test_token(
    session: SessionDep,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> dict:
    """
    Test endpoint to verify token generation works.
    Same as login but returns more info for debugging.
    """
    from app.api.deps import get_current_user, oauth2_scheme
    
    statement = select(User).where(User.email == form_data.username)
    user = session.exec(statement).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token = create_access_token(subject=str(user.id))
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": str(user.id),
        "email": user.email,
        "is_superuser": user.is_superuser,
    }


@router.get("/me", response_model=UserPublic)
async def get_current_user_info(
    current_user: CurrentUser,
) -> UserPublic:
    """
    Get current authenticated user info.
    
    Returns:
        Current user details
    """
    return current_user

