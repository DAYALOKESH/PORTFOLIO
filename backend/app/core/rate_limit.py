"""
Rate limiting configuration using SlowAPI.
Provides rate limiting per IP for various endpoints.
"""
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from fastapi import Request
from fastapi.responses import JSONResponse


# Create limiter instance
limiter = Limiter(key_func=get_remote_address)


# Rate limit rules (as decorators to be applied on endpoints)
# Public read endpoints: 100/minute
PUBLIC_READ_LIMIT = "100/minute"

# Login attempts: 5/minute
LOGIN_LIMIT = "5/minute"

# Comment creation: 10/hour per IP (relaxed from 3 for usability)
COMMENT_LIMIT = "10/hour"

# Media upload: 20/hour per IP
UPLOAD_LIMIT = "20/hour"

# Admin write operations: 60/minute
ADMIN_WRITE_LIMIT = "60/minute"


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    """Custom handler for rate limit exceeded errors."""
    return JSONResponse(
        status_code=429,
        content={
            "error": "rate_limit_exceeded",
            "message": f"Rate limit exceeded: {exc.detail}",
            "retry_after": getattr(exc, 'retry_after', None),
        }
    )
