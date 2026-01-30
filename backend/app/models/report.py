"""
Report table:
Anonymous or logged-in area safety reports.
Used for heatmap + risk analysis.
"""

from sqlalchemy import Column, Integer, String, Float, ForeignKey
from app.models.base import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String(255), nullable=False)
    risk_level = Column(String(20), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
