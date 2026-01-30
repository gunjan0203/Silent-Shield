"""
User table:
Stores both normal users and volunteers.
"""

from sqlalchemy import Column, Integer, String, Enum, Boolean
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String)
    role = Column(Enum("USER", "VOLUNTEER"), default="USER", nullable=False)
    is_active = Column(Boolean, default=True)
