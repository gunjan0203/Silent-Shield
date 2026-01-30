from sqlalchemy import Column, Integer, Float, ForeignKey, DateTime
from app.models.base import Base
from datetime import datetime

class LiveLocation(Base):
    __tablename__ = "live_locations"

    id = Column(Integer, primary_key=True)
    alert_id = Column(Integer, ForeignKey("alerts.id"))
    user_lat = Column(Float)
    user_lng = Column(Float)
    volunteer_lat = Column(Float, nullable=True)
    volunteer_lng = Column(Float, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
