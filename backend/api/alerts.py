from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.database import get_db
from backend.models.db_models import Alert
from backend.services.alert_service import check_and_generate_alerts

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.post("/trigger")
def trigger_alerts(db: Session = Depends(get_db)):
    return check_and_generate_alerts(db)

@router.get("/")
def get_recent_alerts(db: Session = Depends(get_db)):
    alerts = db.query(Alert).order_by(Alert.created_at.desc()).limit(10).all()
    return alerts
