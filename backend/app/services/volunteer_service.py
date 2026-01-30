"""
Volunteer-related business logic
"""

from sqlalchemy.orm import Session
from app.models.volunteer import Volunteer

def create_volunteer(db: Session, user_id: int, id_image_path: str):
    volunteer = Volunteer(
        user_id=user_id,
        id_image_path=id_image_path
    )
    db.add(volunteer)
    db.commit()
    db.refresh(volunteer)
    return volunteer
