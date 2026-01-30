from sqlalchemy import Column, Integer, ForeignKey, String, DateTime
from app.models.base import Base
from datetime import datetime

class AlertVolunteer(Base):
    __tablename__ = "alert_volunteers"

    id = Column(Integer, primary_key=True)
    alert_id = Column(Integer, ForeignKey("alerts.id", ondelete="CASCADE"))
    volunteer_id = Column(Integer, ForeignKey("volunteers.id", ondelete="CASCADE"))
    status = Column(String(20), default="pending")
    accepted_at = Column(DateTime, default=datetime.utcnow)
