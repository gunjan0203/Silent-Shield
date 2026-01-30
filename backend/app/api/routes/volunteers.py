from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.volunteer import Volunteer
from app.models.alert_volunteer import AlertVolunteer
from app.models.alert import Alert
from app.core.security import get_password_hash
from app.core.socket_manager import manager
from datetime import datetime
import os, shutil, uuid, asyncio
from app.core.security import get_current_user

router = APIRouter(prefix="/volunteers", tags=["Volunteers"])

UPLOAD_DIR = "uploads/volunteer_ids"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/signup")
def signup_volunteer(
    full_name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    phone: str = Form(...),
    city: str = Form(...),
    id_photo: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    existing = db.query(Volunteer).filter(Volunteer.email == email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Volunteer already exists")

    ext = id_photo.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(id_photo.file, buffer)

    new_volunteer = Volunteer(
        full_name=full_name,
        email=email,
        phone=phone,
        city=city,
        password=get_password_hash(password),
        id_photo=file_path,
        is_verified=False
    )

    db.add(new_volunteer)
    db.commit()
    db.refresh(new_volunteer)

    return {"message": "Volunteer registered successfully"}

@router.post("/alerts/{alert_id}/accept")
def accept_alert(alert_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if user.get("role") != "volunteer":
        raise HTTPException(status_code=403, detail="Only volunteers allowed")

    volunteer_id = int(user["sub"])

    av = db.query(AlertVolunteer).filter(
        AlertVolunteer.alert_id == alert_id,
        AlertVolunteer.volunteer_id == volunteer_id
    ).first()

    if not av:
        raise HTTPException(status_code=404, detail="Alert not assigned to you")

    if av.status != "pending":
        raise HTTPException(status_code=400, detail="Already responded")

    av.status = "accepted"
    av.responded_at = datetime.utcnow()
    db.commit()

    return {"message": "Alert accepted"}

@router.post("/alerts/{alert_id}/reject")
def reject_alert(alert_id: int, request: Request, db: Session = Depends(get_db)):
    volunteer = request.state.user

    av = db.query(AlertVolunteer).filter(
        AlertVolunteer.alert_id == alert_id,
        AlertVolunteer.volunteer_id == volunteer.id
    ).first()

    if not av:
        raise HTTPException(status_code=404, detail="Alert not assigned")

    av.status = "rejected"
    db.commit()

    return {"message": "Alert rejected"}
