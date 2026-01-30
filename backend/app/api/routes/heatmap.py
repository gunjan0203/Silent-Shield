from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.heatmap_service import get_heatmap_data

router = APIRouter(prefix="/heatmap", tags=["Heatmap"])

@router.get("/")
def get_heatmap(db: Session = Depends(get_db)):
    return get_heatmap_data(db)
