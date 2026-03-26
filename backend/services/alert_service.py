from sqlalchemy.orm import Session
from backend.models.db_models import Alert, Prediction, Customer
from sqlalchemy import func

def check_and_generate_alerts(db: Session):
    total_customers = db.query(Customer).count()
    if total_customers == 0:
        return []
        
    high_risk = db.query(Prediction).filter(Prediction.risk_level == 'High risk').count()
    churn_rate = high_risk / total_customers
    
    alerts_created = []
    
    if churn_rate > 0.15:
        a1 = Alert(alert_type="Churn Spike", severity="Critical", message=f"Overall churn rate exceeded 15%. Current: {churn_rate:.1%}")
        db.add(a1)
        alerts_created.append(a1)
        
    rev_at_risk = db.query(func.sum(Customer.total_spend)).join(Prediction).filter(Prediction.risk_level == 'High risk').scalar() or 0.0
    if rev_at_risk > 10000:
        a2 = Alert(alert_type="Revenue Risk", severity="High", message=f"Revenue at risk crossed $10K target. Current: ${rev_at_risk:,.2f}")
        db.add(a2)
        alerts_created.append(a2)
        
    db.commit()
    return {"alerts_generated": len(alerts_created)}
