"""
Comment model for blog post discussions.
Supports nested/threaded comments via parent_id.
"""
from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlmodel import Field, SQLModel


class CommentBase(SQLModel):
    """Base comment fields."""
    author_name: str = Field(max_length=100)
    content: str = Field(min_length=1)
    is_approved: bool = Field(default=False)


class Comment(CommentBase, table=True):
    """Comment database model."""
    __tablename__ = "comments"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    post_id: UUID = Field(foreign_key="blog_posts.id", index=True)
    parent_id: UUID | None = Field(
        default=None,
        foreign_key="comments.id",
        index=True
    )
    author_email: str = Field(max_length=255)  # Private, not serialized
    ip_address: str = Field(max_length=45, default="")
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    
    # Note: Removed relationships to simplify. 
    # Use direct queries instead.


# Pydantic schemas for API
class CommentCreate(SQLModel):
    """Schema for creating a comment."""
    post_id: UUID
    parent_id: UUID | None = None
    author_name: str = Field(max_length=100)
    author_email: str = Field(max_length=255)
    content: str = Field(min_length=1)


class CommentPublic(SQLModel):
    """Public comment response schema (excludes email/IP)."""
    id: UUID
    post_id: UUID
    parent_id: UUID | None
    author_name: str
    content: str
    is_approved: bool
    created_at: datetime


class CommentWithReplies(CommentPublic):
    """Comment with nested replies for threaded display."""
    replies: list["CommentWithReplies"] = []
