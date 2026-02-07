"""
Database initialization and seeding.
Creates initial data for the application.
"""
from sqlmodel import Session, select

from app.core.config import settings
from app.core.security import get_password_hash
from app.core.logging import logger
from app.models.user import User


def init_db(session: Session) -> None:
    """
    Initialize the database with default data.
    Creates a default admin user if none exists.
    """
    # Check if admin user exists
    statement = select(User).where(User.is_superuser == True)
    admin = session.exec(statement).first()
    
    if not admin:
        logger.info("Creating default admin user...")
        admin_user = User(
            email="admin@portfolio.local",
            hashed_password=get_password_hash("admin123"),  # Change in production!
            full_name="Admin User",
            is_active=True,
            is_superuser=True,
        )
        session.add(admin_user)
        session.commit()
        logger.info(f"Created admin user: {admin_user.email}")
    else:
        logger.info("Admin user already exists, skipping creation.")
