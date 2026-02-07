# Rate Limiting Configuration
# Per-endpoint rate limits for the API

from dataclasses import dataclass
from enum import Enum

class RateLimitTier(Enum):
    """Rate limit tiers for different endpoint categories."""
    PUBLIC_READ = "public_read"
    PUBLIC_WRITE = "public_write"
    AUTH = "auth"
    ADMIN = "admin"
    UPLOAD = "upload"


@dataclass
class RateLimitRule:
    """Rate limit rule configuration."""
    requests: int
    period: str  # "second", "minute", "hour", "day"
    key_func: str = "ip"  # "ip", "user", "global"


# Rate limit rules per tier
RATE_LIMITS = {
    RateLimitTier.PUBLIC_READ: RateLimitRule(
        requests=100,
        period="minute",
        key_func="ip"
    ),
    RateLimitTier.PUBLIC_WRITE: RateLimitRule(
        requests=10,
        period="hour",
        key_func="ip"
    ),
    RateLimitTier.AUTH: RateLimitRule(
        requests=5,
        period="minute",
        key_func="ip"
    ),
    RateLimitTier.ADMIN: RateLimitRule(
        requests=60,
        period="minute",
        key_func="user"
    ),
    RateLimitTier.UPLOAD: RateLimitRule(
        requests=20,
        period="hour",
        key_func="user"
    ),
}

# Endpoint to tier mapping
ENDPOINT_TIERS = {
    # Public endpoints
    "GET /api/v1/posts": RateLimitTier.PUBLIC_READ,
    "GET /api/v1/posts/{slug}": RateLimitTier.PUBLIC_READ,
    "GET /api/v1/projects": RateLimitTier.PUBLIC_READ,
    "GET /api/v1/comments/post/{post_id}": RateLimitTier.PUBLIC_READ,
    
    # Public write
    "POST /api/v1/comments": RateLimitTier.PUBLIC_WRITE,
    
    # Authentication
    "POST /api/v1/auth/login": RateLimitTier.AUTH,
    
    # Admin endpoints
    "POST /api/v1/posts": RateLimitTier.ADMIN,
    "PUT /api/v1/posts/{id}": RateLimitTier.ADMIN,
    "DELETE /api/v1/posts/{id}": RateLimitTier.ADMIN,
    "POST /api/v1/projects": RateLimitTier.ADMIN,
    "PUT /api/v1/projects/{id}": RateLimitTier.ADMIN,
    "DELETE /api/v1/projects/{id}": RateLimitTier.ADMIN,
    
    # Uploads
    "POST /api/v1/media/upload": RateLimitTier.UPLOAD,
}


def get_rate_limit_string(tier: RateLimitTier) -> str:
    """Get rate limit string for SlowAPI decorator."""
    rule = RATE_LIMITS[tier]
    return f"{rule.requests}/{rule.period}"


# Headers for rate limit responses
RATE_LIMIT_HEADERS = {
    "X-RateLimit-Limit": "Maximum requests allowed",
    "X-RateLimit-Remaining": "Requests remaining in current window",
    "X-RateLimit-Reset": "Unix timestamp when the limit resets",
}
