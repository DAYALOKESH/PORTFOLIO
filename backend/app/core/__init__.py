"""Core module initialization - exports all core utilities."""
from app.core.config import settings, get_settings
from app.core.security import (
    create_access_token,
    decode_access_token,
    get_password_hash,
    verify_password,
)
from app.core.logging import logger, setup_logging, get_logger
from app.core.rate_limit import limiter, PUBLIC_READ_LIMIT, LOGIN_LIMIT, COMMENT_LIMIT, UPLOAD_LIMIT
from app.core.exceptions import (
    validation_exception_handler,
    sqlalchemy_exception_handler,
    generic_exception_handler,
)
from app.core.middleware import RequestLoggingMiddleware

__all__ = [
    # Config
    "settings",
    "get_settings",
    # Security
    "create_access_token",
    "decode_access_token",
    "get_password_hash",
    "verify_password",
    # Logging
    "logger",
    "setup_logging",
    "get_logger",
    # Rate Limiting
    "limiter",
    "PUBLIC_READ_LIMIT",
    "LOGIN_LIMIT",
    "COMMENT_LIMIT",
    "UPLOAD_LIMIT",
    # Exceptions
    "validation_exception_handler",
    "sqlalchemy_exception_handler",
    "generic_exception_handler",
    # Middleware
    "RequestLoggingMiddleware",
]
