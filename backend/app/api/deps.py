"""
Dependency injection helpers for FastAPI routes.
"""

from fastapi import Depends, Request
from fastapi.security import HTTPBearer
from app.core.database import get_db
from app.core.security import decode_token
from sqlalchemy.orm import Session

oauth2_scheme = HTTPBearer()

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = decode_token(token)
    return payload  # should be dict with "id"

def db_session() -> Session:
    """
    Returns a database session for route usage
    """
    return Depends(get_db)
