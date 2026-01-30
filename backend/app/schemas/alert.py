"""
Schemas for SOS alerts.
"""

from pydantic import BaseModel
from typing import Optional

class AlertCreate(BaseModel):
    emergency_level: str
    emergency_type: str
    panic_level: Optional[int] = 1   # ✅ ADD THIS
    code: str
    message: Optional[str] = None
    latitude: float
    longitude: float

class AlertResponse(BaseModel):
    id: int
    emergency_level: str
    emergency_type: str
    message: Optional[str]
    code: str
    status: str
    latitude: float
    longitude: float

    class Config:
       from_attributes = True