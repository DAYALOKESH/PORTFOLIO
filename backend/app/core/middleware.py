"""
Request logging middleware.
Logs all incoming requests with timing information.
"""
import time
from typing import Callable

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

from app.core.logging import logger


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log all HTTP requests with timing."""
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Start timer
        start_time = time.time()
        
        # Get request info
        method = request.method
        path = request.url.path
        client_ip = request.client.host if request.client else "unknown"
        
        # Process request
        try:
            response = await call_next(request)
            status_code = response.status_code
        except Exception as e:
            # Log error and re-raise
            logger.error(f"{method} {path} - Error: {str(e)}")
            raise
        
        # Calculate duration
        duration_ms = (time.time() - start_time) * 1000
        
        # Log based on status code
        if status_code >= 500:
            logger.error(
                f"{method} {path} - {status_code} - {duration_ms:.2f}ms - {client_ip}"
            )
        elif status_code >= 400:
            logger.warning(
                f"{method} {path} - {status_code} - {duration_ms:.2f}ms - {client_ip}"
            )
        else:
            logger.info(
                f"{method} {path} - {status_code} - {duration_ms:.2f}ms - {client_ip}"
            )
        
        return response
