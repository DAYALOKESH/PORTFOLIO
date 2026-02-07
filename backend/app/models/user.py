"""
User model for authentication and authorization.
"""
from datetime import datetime, timezone
from uuid import UUID, uuid4

from pydantic import EmailStr
from sqlmodel import Field, SQLModel


class UserBase(SQLModel):
    """Base user fields shared across schemas."""
    # Use str for database column, EmailStr only for Pydantic validation
    email: str = Field(max_length=255, index=True, unique=True)
    full_name: str | None = Field(default=None, max_length=255)
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)


class User(UserBase, table=True):
    """User database model."""
    __tablename__ = "users"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    hashed_password: str = Field(max_length=255)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


# Pydantic schemas for API (can use EmailStr for validation)
class UserCreate(SQLModel):
    """Schema for creating a new user."""
    email: EmailStr
    password: str = Field(min_length=8)
    full_name: str | None = None


class UserUpdate(SQLModel):
    """Schema for updating a user."""
    email: EmailStr | None = None
    password: str | None = Field(default=None, min_length=8)
    full_name: str | None = None
    is_active: bool | None = None


class UserPublic(SQLModel):
    """Public user response schema (no password)."""
    id: UUID
    email: str
    full_name: str | None
    is_active: bool
    is_superuser: bool
    created_at: datetime


class Token(SQLModel):
    """JWT token response schema."""
    access_token: str
    token_type: str = "bearer"


class TokenPayload(SQLModel):
    """JWT token payload schema."""
    sub: str | None = None
    exp: datetime | None = None
