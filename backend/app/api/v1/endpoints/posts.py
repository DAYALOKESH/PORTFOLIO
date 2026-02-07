"""
Blog post endpoints.
Handles CRUD operations for blog posts.
"""
from datetime import datetime, timezone
from uuid import UUID
import re

from fastapi import APIRouter, HTTPException, Query, status
from sqlmodel import select, col

from app.api.deps import CurrentSuperuser, SessionDep
from app.models.post import (
    BlogPost,
    PostCreate,
    PostDetail,
    PostPublic,
    PostStatus,
    PostUpdate,
    Tag,
    PostTagLink,
)
from app.services.markdown import process_markdown, extract_excerpt


router = APIRouter(prefix="/posts", tags=["Blog Posts"])


def generate_slug(title: str) -> str:
    """Generate a URL-safe slug from a title."""
    slug = title.lower().strip()
    # Replace spaces with hyphens
    slug = re.sub(r"\s+", "-", slug)
    # Remove non-alphanumeric characters (except hyphens)
    slug = re.sub(r"[^a-z0-9-]", "", slug)
    # Remove consecutive hyphens
    slug = re.sub(r"-+", "-", slug)
    # Strip leading/trailing hyphens
    slug = slug.strip("-")
    return slug


# ============== Public Endpoints ==============

@router.get("", response_model=list[PostPublic])
async def list_posts(
    session: SessionDep,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    tag: str | None = Query(None, description="Filter by tag slug"),
) -> list[PostPublic]:
    """
    List published blog posts.
    
    Args:
        skip: Number of posts to skip (pagination)
        limit: Maximum posts to return
        tag: Optional tag slug to filter by
        
    Returns:
        List of published posts
    """
    statement = (
        select(BlogPost)
        .where(BlogPost.status == PostStatus.PUBLISHED)
        .order_by(col(BlogPost.published_at).desc())
        .offset(skip)
        .limit(limit)
    )
    
    if tag:
        statement = (
            statement
            .join(PostTagLink, PostTagLink.post_id == BlogPost.id)
            .join(Tag, Tag.id == PostTagLink.tag_id)
            .where(Tag.slug == tag)
        )
    
    posts = session.exec(statement).all()
    return posts


@router.get("/{slug}", response_model=PostDetail)
async def get_post(
    session: SessionDep,
    slug: str,
) -> PostDetail:
    """
    Get a single blog post by slug.
    
    Args:
        slug: Post URL slug
        
    Returns:
        Full post details including HTML content
    """
    statement = select(BlogPost).where(BlogPost.slug == slug)
    post = session.exec(statement).first()
    
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Only allow published posts for public access
    if post.status != PostStatus.PUBLISHED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Increment view count
    post.view_count += 1
    session.add(post)
    session.commit()
    session.refresh(post)
    
    return post


# ============== Admin Endpoints ==============

@router.get("/admin/all", response_model=list[PostPublic])
async def list_all_posts(
    session: SessionDep,
    current_user: CurrentSuperuser,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    status_filter: PostStatus | None = Query(None),
) -> list[PostPublic]:
    """
    List all posts (including drafts) - Admin only.
    
    Args:
        skip: Pagination offset
        limit: Max posts to return
        status_filter: Optional status filter
        
    Returns:
        List of all posts
    """
    statement = (
        select(BlogPost)
        .order_by(col(BlogPost.updated_at).desc())
        .offset(skip)
        .limit(limit)
    )
    
    if status_filter:
        statement = statement.where(BlogPost.status == status_filter)
    
    posts = session.exec(statement).all()
    return posts


@router.post("", response_model=PostDetail, status_code=status.HTTP_201_CREATED)
async def create_post(
    session: SessionDep,
    current_user: CurrentSuperuser,
    post_in: PostCreate,
) -> PostDetail:
    """
    Create a new blog post - Admin only.
    
    Args:
        post_in: Post creation data
        
    Returns:
        Created post
    """
    # Generate slug if not provided
    slug = post_in.slug or generate_slug(post_in.title)
    
    # Check for duplicate slug
    existing = session.exec(
        select(BlogPost).where(BlogPost.slug == slug)
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Post with slug '{slug}' already exists"
        )
    
    # Process markdown to HTML
    content_html = process_markdown(post_in.content_markdown)
    
    # Generate excerpt if not provided
    excerpt = post_in.excerpt or extract_excerpt(post_in.content_markdown, 200)
    
    # Create post
    post = BlogPost(
        title=post_in.title,
        slug=slug,
        excerpt=excerpt,
        content_markdown=post_in.content_markdown,
        content_html=content_html,
        featured_image_url=post_in.featured_image_url,
        status=post_in.status,
    )
    
    # Set published_at if publishing
    if post.status == PostStatus.PUBLISHED:
        post.published_at = datetime.now(timezone.utc)
    
    session.add(post)
    session.commit()
    
    # Handle tags
    if post_in.tags:
        for tag_name in post_in.tags:
            tag_slug = generate_slug(tag_name)
            # Get or create tag
            tag = session.exec(
                select(Tag).where(Tag.slug == tag_slug)
            ).first()
            if not tag:
                tag = Tag(name=tag_name, slug=tag_slug)
                session.add(tag)
                session.commit()
                session.refresh(tag)
            
            # Create link
            link = PostTagLink(post_id=post.id, tag_id=tag.id)
            session.add(link)
        
        session.commit()
    
    session.refresh(post)
    return post


@router.put("/{post_id}", response_model=PostDetail)
async def update_post(
    session: SessionDep,
    current_user: CurrentSuperuser,
    post_id: UUID,
    post_in: PostUpdate,
) -> PostDetail:
    """
    Update a blog post - Admin only.
    
    Args:
        post_id: Post UUID
        post_in: Update data
        
    Returns:
        Updated post
    """
    post = session.get(BlogPost, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Update fields
    update_data = post_in.model_dump(exclude_unset=True)
    
    # Re-process markdown if content changed
    if "content_markdown" in update_data:
        update_data["content_html"] = process_markdown(update_data["content_markdown"])
    
    # Handle status change to published
    if (
        "status" in update_data 
        and update_data["status"] == PostStatus.PUBLISHED
        and post.published_at is None
    ):
        update_data["published_at"] = datetime.now(timezone.utc)
    
    # Update timestamp
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    # Handle tags separately
    tags_to_set = update_data.pop("tags", None)
    
    for key, value in update_data.items():
        setattr(post, key, value)
    
    # Update tags if provided
    if tags_to_set is not None:
        # Remove existing links
        session.exec(
            select(PostTagLink).where(PostTagLink.post_id == post.id)
        )
        existing_links = session.exec(
            select(PostTagLink).where(PostTagLink.post_id == post.id)
        ).all()
        for link in existing_links:
            session.delete(link)
        
        # Add new tags
        for tag_name in tags_to_set:
            tag_slug = generate_slug(tag_name)
            tag = session.exec(
                select(Tag).where(Tag.slug == tag_slug)
            ).first()
            if not tag:
                tag = Tag(name=tag_name, slug=tag_slug)
                session.add(tag)
                session.commit()
                session.refresh(tag)
            
            link = PostTagLink(post_id=post.id, tag_id=tag.id)
            session.add(link)
    
    session.add(post)
    session.commit()
    session.refresh(post)
    
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    session: SessionDep,
    current_user: CurrentSuperuser,
    post_id: UUID,
    hard_delete: bool = Query(False, description="Permanently delete instead of archive"),
) -> None:
    """
    Delete (archive) a blog post - Admin only.
    
    Args:
        post_id: Post UUID
        hard_delete: If True, permanently delete; otherwise archive
    """
    post = session.get(BlogPost, post_id)
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    if hard_delete:
        # Remove tag links first
        links = session.exec(
            select(PostTagLink).where(PostTagLink.post_id == post.id)
        ).all()
        for link in links:
            session.delete(link)
        
        session.delete(post)
    else:
        # Soft delete - archive
        post.status = PostStatus.ARCHIVED
        post.updated_at = datetime.now(timezone.utc)
        session.add(post)
    
    session.commit()
