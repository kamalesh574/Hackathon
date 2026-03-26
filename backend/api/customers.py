from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.db.database import get_db
from backend.models.db_models import Customer, Prediction, Action

router = APIRouter(prefix="/customers", tags=["Customers"])

@router.get("/")
def get_all_customers(db: Session = Depends(get_db), limit: int = 100):
    customers = db.query(Customer).limit(limit).all()
    return customers

@router.get("/high-risk")
def get_high_risk_customers(db: Session = Depends(get_db), limit: int = 100):
    predictions = db.query(Prediction).filter(Prediction.risk_level == "High risk").limit(limit).all()
    return predictions

@router.get("/search")
def search_customers(q: str, db: Session = Depends(get_db), limit: int = 10):
    from sqlalchemy import func, or_
    search = f"%{q.lower()}%"
    customers = db.query(Customer).filter(
        or_(
            func.lower(Customer.customer_id).like(search),
            func.lower(Customer.customer_name).like(search)
        )
    ).limit(limit).all()
    return [{"customer_id": c.customer_id, "customer_name": c.customer_name} for c in customers]

@router.get("/priority")
def get_priority_customers(db: Session = Depends(get_db), limit: int = 50):
    results = db.query(Prediction, Customer.customer_name).join(Customer, Prediction.customer_id == Customer.customer_id).order_by(desc(Prediction.priority_score)).limit(limit).all()
    return [{
        "customer_id": pred.customer_id,
        "customer_name": cname,
        "churn_probability": pred.churn_probability,
        "risk_level": pred.risk_level,
        "priority_score": pred.priority_score
    } for pred, cname in results]

@router.get("/{customer_id}")
def get_customer(customer_id: str, db: Session = Depends(get_db)):
    cust = db.query(Customer).filter(Customer.customer_id == customer_id).first()
    if not cust:
        raise HTTPException(status_code=404, detail="Customer not found")
        
    pred = db.query(Prediction).filter(Prediction.customer_id == customer_id).first()
    action = db.query(Action).filter(Action.customer_id == customer_id).first()
    
    return {
        "profile": cust,
        "prediction": pred,
        "action": action
    }
