from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.database import get_db
from backend.services.campaign_service import CampaignConfig, simulate_campaign

router = APIRouter(prefix="/campaigns", tags=["Campaign Simulator"])

@router.post("/simulate")
def run_simulation(config: CampaignConfig, db: Session = Depends(get_db)):
    results = simulate_campaign(db, config)
    return results
