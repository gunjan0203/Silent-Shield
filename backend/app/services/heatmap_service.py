"""
Generate heatmap data from reports and alerts.
"""

from sqlalchemy.orm import Session
from app.models.report import Report
from app.models.alert import Alert

def get_heatmap_data(db: Session):
    alerts = db.query(Alert).all()
    reports = db.query(Report).all()

    data = []

    for alert in alerts:
        data.append({
            "lat": alert.latitude,
            "lon": alert.longitude,
            "level": alert.panic_level
        })

    for report in reports:
        data.append({
            "lat": report.latitude,
            "lon": report.longitude,
            "level": report.risk_level
        })

    return data
