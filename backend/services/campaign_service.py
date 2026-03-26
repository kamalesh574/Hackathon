from pydantic import BaseModel
from typing import Optional

class CampaignConfig(BaseModel):
    target_group: str
    campaign_type: str
    discount_percent: float
    expected_retention_rate: float
    budget: float

def simulate_campaign(db_session, config: CampaignConfig):
    from backend.models.db_models import Prediction, Customer
    
    # Simple logic
    query = db_session.query(Prediction, Customer).join(Customer)
    
    if config.target_group == 'High Risk':
        query = query.filter(Prediction.risk_level == 'High risk')
    elif config.target_group == 'Medium Risk':
        query = query.filter(Prediction.risk_level == 'Medium risk')
        
    targets = query.all()
    targeted_count = len(targets)
    
    expected_saved = int(targeted_count * config.expected_retention_rate)
    
    # Calculate revenue protected
    revenue_protected = 0.0
    for p, c in targets[:expected_saved]:
        revenue_protected += c.total_spend
        
    # Cost
    roi = 0
    estimated_cost = targeted_count * 5.0 # flat cost per touch
    if config.campaign_type == 'Discount':
        estimated_cost += (revenue_protected * (config.discount_percent / 100))
        
    if estimated_cost > 0:
        roi = ((revenue_protected - estimated_cost) / estimated_cost) * 100
        
    return {
        "targeted_customers": targeted_count,
        "expected_saved": expected_saved,
        "revenue_protected": round(revenue_protected, 2),
        "estimated_cost": round(estimated_cost, 2),
        "roi_percent": round(roi, 2)
    }
