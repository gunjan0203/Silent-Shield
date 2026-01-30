"""
Simple rate-limiting middleware.
Limits number of requests per IP per time window.
"""

import time
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, HTTPException, status

class RateLimitMiddleware(BaseHTTPMiddleware):
    """
    Limits requests per IP.
    Example: max 5 requests per 10 seconds
    """
    def __init__(self, app, max_requests: int = 5, window_seconds: int = 10):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = {}  # {ip: [timestamps]}

    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host

        now = time.time()
        if client_ip not in self.requests:
            self.requests[client_ip] = []

        # Keep only requests inside the time window
        self.requests[client_ip] = [t for t in self.requests[client_ip] if now - t < self.window_seconds]

        if len(self.requests[client_ip]) >= self.max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded: Max {self.max_requests} requests per {self.window_seconds} seconds"
            )

        self.requests[client_ip].append(now)

        return await call_next(request)
