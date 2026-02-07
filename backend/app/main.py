"""
FastAPI Application Entry Point.
Main application configuration with middleware and routes.
"""
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.v1.api import api_router
from app.core.config import settings
from app.core.logging import setup_logging, logger
from app.core.rate_limit import limiter
from app.core.exceptions import (
    validation_exception_handler,
    sqlalchemy_exception_handler,
    generic_exception_handler,
)
from app.core.middleware import RequestLoggingMiddleware
from app.db.session import engine
from sqlmodel import SQLModel


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan handler.
    Runs startup and shutdown tasks.
    """
    # Startup
    setup_logging()
    logger.info(f"Starting {settings.PROJECT_NAME}")
    logger.info(f"Debug mode: {settings.DEBUG}")
    logger.info(f"CORS Origins: {settings.CORS_ORIGINS}")
    
    # Create database tables (for development)
    # In production, use Alembic migrations
    SQLModel.metadata.create_all(engine)
    logger.info("Database tables created/verified")
    
    # Initialize database with default data (create admin user if needed)
    from app.db.init_db import init_db
    from sqlmodel import Session
    with Session(engine) as session:
        init_db(session)
    
    # Ensure uploads directory exists
    if settings.USE_LOCAL_STORAGE:
        uploads_path = Path(settings.LOCAL_STORAGE_PATH)
        uploads_path.mkdir(parents=True, exist_ok=True)
        (uploads_path / "images").mkdir(exist_ok=True)
        logger.info(f"Local storage directory: {uploads_path.absolute()}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down application")


# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Portfolio & Blog API built with FastAPI and SQLModel",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Attach rate limiter to app state
app.state.limiter = limiter

# ============== Exception Handlers ==============
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# ============== Middleware Stack ==============
# Note: Middleware is executed in reverse order (last added = first executed)

# 1. Request Logging (outermost - logs all requests)
app.add_middleware(RequestLoggingMiddleware)

# 2. CORS (must be before other handlers)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID", "X-RateLimit-Limit", "X-RateLimit-Remaining"],
)

# Include API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

# Mount static files for local uploads
if settings.USE_LOCAL_STORAGE:
    uploads_path = Path(settings.LOCAL_STORAGE_PATH)
    if uploads_path.exists():
        app.mount(
            "/uploads",
            StaticFiles(directory=str(uploads_path)),
            name="uploads"
        )


@app.get("/", tags=["Health"])
async def root():
    """Root endpoint - health check."""
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
