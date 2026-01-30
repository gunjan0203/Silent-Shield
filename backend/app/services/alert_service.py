from sqlalchemy.orm import Session
from app.models.alert import Alert
from app.models.volunteer import Volunteer
from app.models.alert_volunteer import AlertVolunteer
from app.utils.geo import haversine

# from backend.app.models import alert

MAX_RADIUS_KM = 20
MIN_RADIUS_KM = 0
REQUIRED_VOLUNTEERS = 3
MAX_VOLUNTEERS_NOTIFIED = 5

def create_alert(db: Session, user_id: int | None, **data):
    existing = db.query(Alert).filter(
        Alert.user_id == user_id,
        Alert.status == "active"
    ).first()
    if existing:
        return existing

    if "panic_level" not in data or data["panic_level"] is None:
        data["panic_level"] = 1

    alert = Alert(user_id=user_id, status="active", **data)  # ✅ FIXED
    db.add(alert)
    db.commit()
    db.refresh(alert)

    print("✅ Alert created:", alert.id)

    if alert.emergency_level in ["yellow", "red"]:
        assign_volunteers(db, alert)

    return alert


def assign_volunteers(db: Session, alert: Alert):
    print("🔥 assign_volunteers() CALLED for alert:", alert.id)

    volunteers = db.query(Volunteer).filter(Volunteer.is_verified == True).all()
    print("👥 Volunteers found:", len(volunteers))

    matched = []

    for v in volunteers:
        if not hasattr(v, "latitude") or not hasattr(v, "longitude"):
            print("⚠️ Volunteer missing lat/lng:", v.id)
            continue

        distance = haversine(alert.latitude, alert.longitude, v.latitude, v.longitude)
        if MIN_RADIUS_KM <= distance <= MAX_RADIUS_KM:
            matched.append((v, distance))

    matched.sort(key=lambda x: x[1])

    for v, _ in matched[:REQUIRED_VOLUNTEERS]:
        av = AlertVolunteer(
            alert_id=alert.id,
            volunteer_id=v.id,
            status="pending"
        )
        db.add(av)

    db.commit()
    print("✅ Volunteers assigned:", len(matched[:REQUIRED_VOLUNTEERS]))

# async def notify_volunteer(volunteer_id, alert):
#     await manager.send_to_volunteer(volunteer_id, {
#         "type": "NEW_ALERT",
#         "alert_id": alert.id,
#         "latitude": alert.latitude,
#         "longitude": alert.longitude,
#         "level": alert.emergency_level,
#         "type_need": alert.emergency_type
#     })