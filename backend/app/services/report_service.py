"""
Handles anonymous or logged-in area safety reports.
"""

from sqlalchemy.orm import Session
from app.models.report import Report
from app.services.ai_service import analyze_report

def create_report(db: Session, user_id: int | None, description: str, latitude: float, longitude: float):
    risk_level = analyze_report(description)

    report = Report(
        user_id=user_id,
        description=description,
        risk_level=risk_level,
        latitude=latitude,
        longitude=longitude
    )

    db.add(report)
    db.commit()
    db.refresh(report)
    return report
