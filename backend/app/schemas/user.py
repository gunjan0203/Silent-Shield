from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserBase(BaseModel):
    full_name: str
    email: EmailStr
    role: str


class UserSignup(UserBase):
    hashed_password: str


class UserCreate(UserSignup):
    pass


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    is_active: bool

    class Config:
        from_attributes = True
