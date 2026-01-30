from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from sqlalchemy.orm import Session
from app.core.database import SessionLocal
from app.core.security import decode_access_token
from app.models.user import User


class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        public_paths = [
            "/",
            "/docs",
            "/redoc",
            "/openapi.json",
            "/favicon.ico",
            "/auth/login",
            "/auth/signup",
            "/volunteers/signup",
            "/volunteers/login"   
        ]

        path = request.url.path

        # 🔓 Skip auth for public routes
        # if path in public_paths or path.startswith("/auth"):
        #     return await call_next(request)
        if any(path.startswith(pub_path) for pub_path in public_paths):
            return await call_next(request)

        # 🔐 Token required for others
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Missing token"
            )

        token = auth_header.split(" ")[1]
        payload = decode_access_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token"
            )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload"
            )

        db: Session = SessionLocal()
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if not user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="User not found"
                )
            request.state.user = user
        finally:
            db.close()

        return await call_next(request)
