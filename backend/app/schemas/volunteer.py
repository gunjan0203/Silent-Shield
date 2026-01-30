"""
Schemas for volunteer responses.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional

# class VolunteerResponse(BaseModel):
#     id: int
#     full_name: str
#     email: EmailStr
#     phone: str
#     city: str
#     id_photo: str
#     is_active: bool
#     class Config:
#         orm_mode = True
class VolunteerBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    city: Optional[str] = None


class VolunteerSignup(VolunteerBase):
    password: str


class VolunteerResponse(VolunteerBase):
    id: int
    id_photo: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True