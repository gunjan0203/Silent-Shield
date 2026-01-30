from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.user import User
from app.models.volunteer import Volunteer
from app.schemas.user import UserCreate
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token
)
from passlib.context import CryptContext
from app.schemas.auth import SignupSchema, LoginSchema
# from app.utils import get_password_hash



router = APIRouter(prefix="/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ---------------- USER SIGNUP ----------------
from app.schemas.auth import SignupSchema

@router.post("/signup")
def signup(data: SignupSchema, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    user = User(
        full_name=data.full_name,
        email=data.email,
        hashed_password=get_password_hash(data.password),
        role=data.role
    )
    db.add(user)
    db.commit()
    return {"message": "Signup successful"}


# ---------------- USER + VOLUNTEER LOGIN ----------------
@router.post("/login")
def universal_login(data: LoginSchema, db: Session = Depends(get_db)):

    email = data.email
    password = data.password

    # 🔍 USER
    user = db.query(User).filter(User.email == email).first()
    if user and verify_password(password, user.hashed_password):
        token = create_access_token({"sub": str(user.id), "role": "user"})
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": "user"
        }

    # 🔍 VOLUNTEER
    volunteer = db.query(Volunteer).filter(Volunteer.email == email).first()
    if volunteer and verify_password(password, volunteer.password):
        token = create_access_token({"sub": str(volunteer.id), "role": "volunteer"})
        return {
            "access_token": token,
            "token_type": "bearer",
            "role": "volunteer"
        }

    raise HTTPException(status_code=400, detail="Invalid credentials")
