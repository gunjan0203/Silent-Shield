from fastapi import APIRouter, Depends, Request, HTTPException
from sqlalchemy.orm import Session
from app.schemas.alert import AlertCreate, AlertResponse
from app.models.alert_volunteer import AlertVolunteer
from app.models.alert import Alert
from app.core.database import get_db
from app.services.alert_service import create_alert
from app.core.security import get_current_user
from datetime import datetime

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.post("/", response_model=AlertResponse)
def send_alert(
    alert: AlertCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    print("👤 Current user:", current_user)

    user_id = current_user["id"]  # ✅ FIX — dict se id nikalo

    new_alert = create_alert(db, user_id=user_id, **alert.dict())
    return new_alert

@router.post("/guest", response_model=AlertResponse)
def guest_alert(alert: AlertCreate, db: Session = Depends(get_db)):
    # Skip login, SOS directly
    new_alert = create_alert(db, user_id=None, **alert.dict())
    return new_alert

@router.post("/{alert_id}/volunteers/respond")
def volunteer_respond(alert_id: int, volunteer_id: int, action: str, db: Session = Depends(get_db)):
    """
    Volunteer responds to an alert: 'accept' or 'reject'.
    """
    av = db.query(AlertVolunteer).filter(
        AlertVolunteer.alert_id == alert_id,
        AlertVolunteer.volunteer_id == volunteer_id
    ).first()

    if not av:
        raise HTTPException(status_code=404, detail="Volunteer not assigned to this alert")

    if av.status != "pending":
        raise HTTPException(status_code=400, detail="Already responded")

    if action not in ["accept", "reject"]:
        raise HTTPException(status_code=400, detail="Invalid action")

    av.status = action
    av.responded_at = datetime.utcnow()
    db.commit()
    db.refresh(av)

    # Check if enough volunteers accepted
    accepted_count = db.query(AlertVolunteer).filter(
        AlertVolunteer.alert_id == alert_id,
        AlertVolunteer.status == "accept"
    ).count()

    return {"status": av.status, "accepted_count": accepted_count}

@router.post("/{alert_id}/resolve")
def resolve_alert(alert_id: int, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    if alert.status == "resolved":
        raise HTTPException(status_code=400, detail="Alert already resolved")

    alert.status = "resolved"
    alert.resolved_at = datetime.utcnow()
    db.commit()
    db.refresh(alert)

    return {"message": "Alert resolved successfully"}
