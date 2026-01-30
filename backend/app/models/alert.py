# """
# Alert table:
# Stores SOS events.
# """
# Gunjan's Code 

from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from app.models.base import Base
from datetime import datetime

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), nullable=False)
    message = Column(String(255))
    emergency_level = Column(String(10), nullable=False)   # green/yellow/red
    emergency_type = Column(String(50), nullable=False)    # medical, unsafe etc
    panic_level = Column(Integer, default=1)   # ✅ ADD THIS
    status = Column(String(20), default="active")      
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)