# CORS Configuration
# Environment-specific CORS settings for the API

# Development
DEV_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
]

# Staging
STAGING_ORIGINS = [
    "https://staging.yourdomain.com",
    "https://admin-staging.yourdomain.com",
]

# Production
PROD_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
    "https://admin.yourdomain.com",
]

# CORS Headers Configuration
CORS_CONFIG = {
    "allow_credentials": True,
    "allow_methods": ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    "allow_headers": [
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "X-Requested-With",
        "X-Request-ID",
    ],
    "expose_headers": [
        "X-Request-ID",
        "X-RateLimit-Limit",
        "X-RateLimit-Remaining",
        "X-RateLimit-Reset",
    ],
    "max_age": 600,  # 10 minutes
}
