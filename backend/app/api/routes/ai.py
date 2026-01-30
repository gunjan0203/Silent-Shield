from fastapi import APIRouter
from app.services.ai_service import classify_panic, analyze_report

router = APIRouter(prefix="/ai", tags=["AI"])

@router.post("/panic")
def classify_panic_route(code: str):
    return {"panic_level": classify_panic(code)}

@router.post("/report_risk")
def report_risk(description: str):
    return {"risk_level": analyze_report(description)}
