"""
Database session management.
Provides SQLModel engine and session factory.
"""
from collections.abc import Generator

from sqlmodel import Session, create_engine

from app.core.config import settings


# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,  # Log SQL queries in debug mode
    pool_pre_ping=True,  # Verify connections before use
    pool_size=5,
    max_overflow=10,
)


def get_session() -> Generator[Session, None, None]:
    """
    Dependency that provides a database session.
    Automatically handles session lifecycle.
    """
    with Session(engine) as session:
        try:
            yield session
            session.commit()
        except Exception:
            session.rollback()
            raise
