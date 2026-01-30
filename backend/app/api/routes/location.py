from fastapi import APIRouter, Depends, Request
from app.core.socket_manager import manager

router = APIRouter(prefix="/location", tags=["Location"])

@router.post("/update")
async def update_location(data: dict, request: Request):
    user = request.state.user
    alert_id = data.get("alert_id")

    # send to all accepted volunteers
    from app.core.database import SessionLocal
    from app.models.alert_volunteer import AlertVolunteer

    db = SessionLocal()
    rows = db.query(AlertVolunteer).filter(
        AlertVolunteer.alert_id == alert_id,
        AlertVolunteer.status == "accepted"
    ).all()

    for row in rows:
        await manager.send_to_volunteer(row.volunteer_id, {
            "type": "LIVE_LOCATION",
            "latitude": data["latitude"],
            "longitude": data["longitude"]
        })

    return {"status": "ok"}
