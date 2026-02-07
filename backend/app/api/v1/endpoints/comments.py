"""
Comment endpoints.
Handles comment creation and retrieval for blog posts.
"""
from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, Request, status
from sqlmodel import select, col

from app.api.deps import CurrentSuperuser, SessionDep
from app.models.comment import (
    Comment,
    CommentCreate,
    CommentPublic,
    CommentWithReplies,
)
from app.models.post import BlogPost, PostStatus


router = APIRouter(prefix="/comments", tags=["Comments"])


def get_client_ip(request: Request) -> str:
    """Extract client IP from request."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def build_comment_tree(
    comments: list[Comment],
    parent_id: UUID | None = None,
    max_depth: int = 3,
    current_depth: int = 0,
) -> list[CommentWithReplies]:
    """Recursively build nested comment tree."""
    if current_depth >= max_depth:
        return []
    
    result = []
    for comment in comments:
        if comment.parent_id == parent_id:
            replies = build_comment_tree(
                comments,
                parent_id=comment.id,
                max_depth=max_depth,
                current_depth=current_depth + 1,
            )
            comment_with_replies = CommentWithReplies(
                id=comment.id,
                post_id=comment.post_id,
                parent_id=comment.parent_id,
                author_name=comment.author_name,
                content=comment.content,
                is_approved=comment.is_approved,
                created_at=comment.created_at,
                replies=replies,
            )
            result.append(comment_with_replies)
    
    return result


# ============== Public Endpoints ==============

@router.get("/post/{post_id}", response_model=list[CommentWithReplies])
async def list_comments(
    session: SessionDep,
    post_id: UUID,
    include_unapproved: bool = Query(False),
) -> list[CommentWithReplies]:
    """
    List comments for a blog post (nested/threaded).
    
    Args:
        post_id: Post UUID
        include_unapproved: Include unapproved comments (for admin preview)
        
    Returns:
        Nested comment tree
    """
    # Verify post exists and is published
    post = session.get(BlogPost, post_id)
    if not post or post.status != PostStatus.PUBLISHED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    statement = (
        select(Comment)
        .where(Comment.post_id == post_id)
        .order_by(col(Comment.created_at).asc())
    )
    
    if not include_unapproved:
        statement = statement.where(Comment.is_approved == True)
    
    comments = session.exec(statement).all()
    
    return build_comment_tree(list(comments))


@router.post("", response_model=CommentPublic, status_code=status.HTTP_201_CREATED)
async def create_comment(
    session: SessionDep,
    request: Request,
    comment_in: CommentCreate,
) -> CommentPublic:
    """
    Create a new comment on a blog post.
    
    Comments require moderation by default (is_approved=False).
    
    Args:
        comment_in: Comment data
        
    Returns:
        Created comment (pending approval)
    """
    # Verify post exists and is published
    post = session.get(BlogPost, comment_in.post_id)
    if not post or post.status != PostStatus.PUBLISHED:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # Verify parent comment if replying
    if comment_in.parent_id:
        parent = session.get(Comment, comment_in.parent_id)
        if not parent or parent.post_id != comment_in.post_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid parent comment"
            )
    
    comment = Comment(
        post_id=comment_in.post_id,
        parent_id=comment_in.parent_id,
        author_name=comment_in.author_name,
        author_email=comment_in.author_email,
        content=comment_in.content,
        ip_address=get_client_ip(request),
        is_approved=False,  # Require moderation
        created_at=datetime.now(timezone.utc),
    )
    
    session.add(comment)
    session.commit()
    session.refresh(comment)
    
    return CommentPublic(
        id=comment.id,
        post_id=comment.post_id,
        parent_id=comment.parent_id,
        author_name=comment.author_name,
        content=comment.content,
        is_approved=comment.is_approved,
        created_at=comment.created_at,
    )


# ============== Admin Endpoints ==============

@router.get("/admin/pending", response_model=list[CommentPublic])
async def list_pending_comments(
    session: SessionDep,
    current_user: CurrentSuperuser,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
) -> list[CommentPublic]:
    """
    List all pending (unapproved) comments - Admin only.
    
    Returns:
        List of comments awaiting moderation
    """
    statement = (
        select(Comment)
        .where(Comment.is_approved == False)
        .order_by(col(Comment.created_at).desc())
        .offset(skip)
        .limit(limit)
    )
    
    comments = session.exec(statement).all()
    return comments


@router.put("/{comment_id}/approve", response_model=CommentPublic)
async def approve_comment(
    session: SessionDep,
    current_user: CurrentSuperuser,
    comment_id: UUID,
) -> CommentPublic:
    """
    Approve a comment for display - Admin only.
    
    Args:
        comment_id: Comment UUID
        
    Returns:
        Updated comment
    """
    comment = session.get(Comment, comment_id)
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    comment.is_approved = True
    session.add(comment)
    session.commit()
    session.refresh(comment)
    
    return comment


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    session: SessionDep,
    current_user: CurrentSuperuser,
    comment_id: UUID,
) -> None:
    """
    Delete a comment - Admin only.
    
    Args:
        comment_id: Comment UUID
    """
    comment = session.get(Comment, comment_id)
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    session.delete(comment)
    session.commit()
