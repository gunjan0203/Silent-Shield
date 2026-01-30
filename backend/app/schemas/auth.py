"""
Schemas for authentication (login, token response).
"""

from pydantic import BaseModel, EmailStr

class LoginSchema(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

from enum import Enum

class Role(str, Enum):
    USER = "USER"
    VOLUNTEER = "VOLUNTEER"

class SignupSchema(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: str