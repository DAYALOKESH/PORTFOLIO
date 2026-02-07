"""
Project model for portfolio showcase.
"""
from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlmodel import Column, Field, SQLModel
from sqlalchemy import JSON


class ProjectBase(SQLModel):
    """Base project fields."""
    title: str = Field(max_length=255)
    description: str = Field(default="")
    tech_stack: list[str] = Field(default_factory=list, sa_column=Column(JSON))
    repo_url: str | None = Field(default=None, max_length=512)
    live_url: str | None = Field(default=None, max_length=512)
    thumbnail_url: str = Field(default="", max_length=512)
    order: int = Field(default=0, index=True)
    is_featured: bool = Field(default=False)


class Project(ProjectBase, table=True):
    """Project database model."""
    __tablename__ = "projects"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )


# Pydantic schemas for API
class ProjectCreate(SQLModel):
    """Schema for creating a project."""
    title: str = Field(max_length=255)
    description: str = ""
    tech_stack: list[str] = Field(default_factory=list)
    repo_url: str | None = None
    live_url: str | None = None
    thumbnail_url: str = ""
    order: int = 0
    is_featured: bool = False


class ProjectUpdate(SQLModel):
    """Schema for updating a project."""
    title: str | None = None
    description: str | None = None
    tech_stack: list[str] | None = None
    repo_url: str | None = None
    live_url: str | None = None
    thumbnail_url: str | None = None
    order: int | None = None
    is_featured: bool | None = None


class ProjectPublic(ProjectBase):
    """Public project response schema."""
    id: UUID
    created_at: datetime
    updated_at: datetime
