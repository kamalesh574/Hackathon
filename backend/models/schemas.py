from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CustomerBase(BaseModel):
    customer_id: str
    email: Optional[str] = None
    region: Optional[str] = None
    plan_type: Optional[str] = None
    subscription_status: Optional[str] = None
    total_spend: Optional[float] = 0.0
    
class PredictionResponse(BaseModel):
    customer_id: str
    churn_probability: float
    risk_level: str
    priority_score: Optional[float] = None
    churn_reasons: Optional[str] = None

class ActionCreate(BaseModel):
    customer_id: str
    action_type: str
    action_priority: str
    owner: Optional[str] = "Unassigned"
