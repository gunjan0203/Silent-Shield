from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.schemas.report import ReportCreate, ReportResponse
from app.core.database import get_db
from app.services.report_service import create_report

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/", response_model=ReportResponse)
def create_user_report(report: ReportCreate, request: Request, db: Session = Depends(get_db)):
    user_id = getattr(request.state, "user", None)
    user_id = user_id.id if user_id else None
    new_report = create_report(db, user_id=user_id, **report.dict())
    return new_report
