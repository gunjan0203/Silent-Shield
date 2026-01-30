"""
Volunteer table:
Extra data only if user.role == VOLUNTEER.
"""

from sqlalchemy import Column, Float, Integer, String, ForeignKey, Boolean
# from app.models.base import Base
from app.core.database import Base


class Volunteer(Base):
    __tablename__ = "volunteers"

    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(100), unique=True, index=True)
    phone = Column(String(20), nullable=True)
    city = Column(String(100), nullable=True)
    id_photo = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    password = Column(String(255), nullable=False)
    is_verified = Column(Boolean, default=True)   # ✅ ADD THIS
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)