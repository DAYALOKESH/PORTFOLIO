"""
API v1 router aggregation.
Combines all endpoint routers into a single API router.
"""
from fastapi import APIRouter

from app.api.v1.endpoints import auth, posts, projects, media, comments


api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router)
api_router.include_router(posts.router)
api_router.include_router(projects.router)
api_router.include_router(media.router)
api_router.include_router(comments.router)
