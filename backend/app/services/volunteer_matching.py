from sqlalchemy.orm import Session
from app.models.volunteer import Volunteer
from app.utils.distance import haversine

def find_nearby_volunteers(db: Session, lat: float, lon: float):
    volunteers = db.query(Volunteer).filter(
        Volunteer.is_verified == True
    ).all()

    nearby = []

    for v in volunteers:
        dist = haversine(lat, lon, v.latitude, v.longitude)
        if dist <= 1:  # 1 km
            nearby.append((v, dist))

    # sort nearest first
    nearby.sort(key=lambda x: x[1])
    return nearby[:5]  # max 5 ko notify
