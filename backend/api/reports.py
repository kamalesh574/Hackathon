from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import pandas as pd
import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from backend.db.database import get_db
from backend.models.db_models import Customer, Prediction, Action

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/powerbi-export")
def generate_powerbi_exports(db: Session = Depends(get_db)):
    """Generate CSV exports from SQLite for Power BI."""
    os.makedirs('powerbi/exports', exist_ok=True)
    
    # Export Customers with Predictions
    query = db.query(Customer, Prediction).outerjoin(Prediction, Customer.customer_id == Prediction.customer_id)
    data = []
    for c, p in query.all():
        row = {"customer_id": c.customer_id, "region": c.region, "plan_type": c.plan_type, "total_spend": c.total_spend}
        if p:
            row.update({
                "churn_probability": p.churn_probability,
                "risk_level": p.risk_level,
                "priority_score": p.priority_score,
                "churn_reasons": p.churn_reasons
            })
        data.append(row)
        
    df = pd.DataFrame(data)
    export_path = 'powerbi/exports/customer_predictions.csv'
    df.to_csv(export_path, index=False)
    
    return {"message": "Export generated successfully", "path": export_path}

@router.get("/download-predictions")
def download_predictions():
    path = "powerbi/exports/customer_predictions.csv"
    if os.path.exists(path):
        return FileResponse(path, filename="customer_predictions.csv")
    return {"error": "Report not generated yet. Please click 'Generate BI Snapshot'."}

@router.get("/download-pdf")
def download_pdf(db: Session = Depends(get_db)):
    os.makedirs('powerbi/exports', exist_ok=True)
    pdf_path = "powerbi/exports/Executive_Churn_Report.pdf"
    
    query = db.query(Prediction).all()
    if not query:
        return {"error": "No prediction data available."}
        
    high_risk = sum(1 for p in query if p.risk_level == "High risk")
    medium_risk = sum(1 for p in query if p.risk_level == "Medium risk")
    low_risk = len(query) - high_risk - medium_risk
    
    plt.figure(figsize=(10, 6))
    plt.pie(
        [high_risk, medium_risk, low_risk], 
        labels=["High Risk", "Medium Risk", "Low Risk"], 
        autopct='%1.1f%%', 
        colors=['#ef4444', '#f97316', '#22c55e']
    )
    plt.title("ChurnSense Executive Summary: Customer Risk Distribution\n")
    plt.savefig(pdf_path, format="pdf", bbox_inches="tight")
    plt.close()
    
    return FileResponse(pdf_path, filename="Executive_Churn_Report.pdf", media_type='application/pdf')
