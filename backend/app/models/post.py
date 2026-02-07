"""
Blog post and tag models for content management.
"""
from datetime import datetime, timezone
from enum import Enum
from uuid import UUID, uuid4

from sqlmodel import Field, Relationship, SQLModel


class PostStatus(str, Enum):
    """Enum for blog post status."""
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


# Link table for many-to-many relationship between posts and tags
class PostTagLink(SQLModel, table=True):
    """Association table for post-tag many-to-many relationship."""
    __tablename__ = "post_tag_links"
    
    post_id: UUID = Field(foreign_key="blog_posts.id", primary_key=True)
    tag_id: UUID = Field(foreign_key="tags.id", primary_key=True)


class TagBase(SQLModel):
    """Base tag fields."""
    name: str = Field(max_length=100, unique=True, index=True)
    slug: str = Field(max_length=100, unique=True, index=True)


class Tag(TagBase, table=True):
    """Tag database model."""
    __tablename__ = "tags"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    
    # Relationships - use string reference
    posts: list["BlogPost"] = Relationship(
        back_populates="tags",
        link_model=PostTagLink
    )


class BlogPostBase(SQLModel):
    """Base blog post fields."""
    title: str = Field(max_length=255)
    slug: str = Field(max_length=255, unique=True, index=True)
    excerpt: str = Field(max_length=500, default="")
    content_markdown: str = Field(default="")
    content_html: str = Field(default="")
    featured_image_url: str | None = Field(default=None, max_length=512)
    status: PostStatus = Field(default=PostStatus.DRAFT, index=True)
    view_count: int = Field(default=0)


class BlogPost(BlogPostBase, table=True):
    """Blog post database model."""
    __tablename__ = "blog_posts"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    published_at: datetime | None = Field(default=None)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    
    # Relationships - simplified without Comment relationship 
    # (Comment will have the relationship to BlogPost)
    tags: list[Tag] = Relationship(
        back_populates="posts",
        link_model=PostTagLink
    )


# Pydantic schemas for API
class TagCreate(SQLModel):
    """Schema for creating a tag."""
    name: str = Field(max_length=100)
    slug: str | None = None  # Auto-generate if not provided


class TagPublic(TagBase):
    """Public tag response schema."""
    id: UUID


class PostCreate(SQLModel):
    """Schema for creating a blog post."""
    title: str = Field(max_length=255)
    slug: str | None = None  # Auto-generate if not provided
    excerpt: str = Field(default="", max_length=500)
    content_markdown: str
    featured_image_url: str | None = None
    status: PostStatus = PostStatus.DRAFT
    tags: list[str] = Field(default_factory=list)  # Tag names


class PostUpdate(SQLModel):
    """Schema for updating a blog post."""
    title: str | None = None
    slug: str | None = None
    excerpt: str | None = None
    content_markdown: str | None = None
    featured_image_url: str | None = None
    status: PostStatus | None = None
    tags: list[str] | None = None  # Tag names


class PostPublic(BlogPostBase):
    """Public post response schema (list view)."""
    id: UUID
    published_at: datetime | None
    created_at: datetime
    tags: list[TagPublic] = []


class PostDetail(PostPublic):
    """Detailed post response schema (includes HTML content)."""
    updated_at: datetime
