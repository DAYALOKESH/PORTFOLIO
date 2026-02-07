# Error Codes and Response Formats
# Standardized error codes for consistent API responses

from enum import Enum
from dataclasses import dataclass
from typing import Optional, List, Dict, Any


class ErrorCode(Enum):
    """Standardized error codes for the API."""
    # 400 Bad Request
    BAD_REQUEST = "bad_request"
    INVALID_INPUT = "invalid_input"
    MALFORMED_JSON = "malformed_json"
    
    # 401 Unauthorized
    UNAUTHORIZED = "unauthorized"
    INVALID_TOKEN = "invalid_token"
    EXPIRED_TOKEN = "expired_token"
    MISSING_TOKEN = "missing_token"
    
    # 403 Forbidden
    FORBIDDEN = "forbidden"
    INSUFFICIENT_PERMISSIONS = "insufficient_permissions"
    
    # 404 Not Found
    NOT_FOUND = "not_found"
    RESOURCE_NOT_FOUND = "resource_not_found"
    
    # 409 Conflict
    CONFLICT = "conflict"
    DUPLICATE_RESOURCE = "duplicate_resource"
    
    # 422 Unprocessable Entity
    VALIDATION_ERROR = "validation_error"
    FIELD_REQUIRED = "field_required"
    FIELD_INVALID = "field_invalid"
    
    # 429 Too Many Requests
    RATE_LIMIT_EXCEEDED = "rate_limit_exceeded"
    
    # 500 Internal Server Error
    INTERNAL_ERROR = "internal_error"
    DATABASE_ERROR = "database_error"
    EXTERNAL_SERVICE_ERROR = "external_service_error"


@dataclass
class ErrorDetail:
    """Individual field error detail."""
    field: str
    message: str
    code: Optional[str] = None


@dataclass
class ApiErrorResponse:
    """Standard API error response format."""
    error: str
    message: str
    details: Optional[List[Dict[str, Any]]] = None
    request_id: Optional[str] = None
    
    def to_dict(self) -> dict:
        result = {
            "error": self.error,
            "message": self.message,
        }
        if self.details:
            result["details"] = self.details
        if self.request_id:
            result["request_id"] = self.request_id
        return result


# HTTP Status Code to Error Code Mapping
STATUS_ERROR_MAP = {
    400: ErrorCode.BAD_REQUEST,
    401: ErrorCode.UNAUTHORIZED,
    403: ErrorCode.FORBIDDEN,
    404: ErrorCode.NOT_FOUND,
    409: ErrorCode.CONFLICT,
    422: ErrorCode.VALIDATION_ERROR,
    429: ErrorCode.RATE_LIMIT_EXCEEDED,
    500: ErrorCode.INTERNAL_ERROR,
}


# User-friendly error messages
ERROR_MESSAGES = {
    ErrorCode.BAD_REQUEST: "The request was invalid or cannot be served.",
    ErrorCode.UNAUTHORIZED: "Authentication is required to access this resource.",
    ErrorCode.INVALID_TOKEN: "The provided authentication token is invalid.",
    ErrorCode.EXPIRED_TOKEN: "The authentication token has expired.",
    ErrorCode.FORBIDDEN: "You do not have permission to access this resource.",
    ErrorCode.NOT_FOUND: "The requested resource was not found.",
    ErrorCode.CONFLICT: "A resource with this identifier already exists.",
    ErrorCode.VALIDATION_ERROR: "The request data failed validation.",
    ErrorCode.RATE_LIMIT_EXCEEDED: "Too many requests. Please try again later.",
    ErrorCode.INTERNAL_ERROR: "An unexpected error occurred.",
}
