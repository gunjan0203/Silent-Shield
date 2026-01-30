"""
Schemas for community safety reports.
"""

from pydantic import BaseModel
from typing import Optional

class ReportCreate(BaseModel):
    description: str
    latitude: float
    longitude: float

class ReportResponse(BaseModel):
    id: int
    description: str
    risk_level: str
    latitude: float
    longitude: float
    user_id: Optional[int]

    class Config:
        orm_mode = True
