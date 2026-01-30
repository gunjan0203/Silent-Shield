from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.user import UserResponse
from app.core.database import get_db
from app.models.user import User
from app.core.security import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.get("/me", response_model=UserResponse)

def get_me(user=Depends(get_current_user)):
    return user
def get_current_user(request: Request):
    """
    Fetch logged-in user's profile.
    """
    user = getattr(request.state, "user", None)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
    return user

@router.get("/", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db)):
    """
    Fetch all users (admin feature).
    """
    users = db.query(User).all()
    return users
