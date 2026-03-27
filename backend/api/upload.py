from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
from backend.db.database import get_db
import pandas as pd
import io
import os

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("/customers")
async def upload_customers(file: UploadFile = File(...), db: Session = Depends(get_db)):
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    
    # Save raw to uploads
    os.makedirs('data/uploads', exist_ok=True)
    file_path = f'data/uploads/{file.filename}'
    df.to_csv(file_path, index=False)
    
    # Store minimal info to DB
    from backend.models.db_models import Customer
    from sqlalchemy.dialects.sqlite import insert
    
    records = df.to_dict(orient="records")
    for row in records:
        customer_id = str(row.get("customer_id"))
        if not customer_id:
            continue
            
        region = str(row.get("region", ""))
        plan_type = str(row.get("plan_type", ""))
        status = str(row.get("subscription_status", ""))
        customer_name = str(row.get("customer_name", "Unknown"))
        
        # Simple upsert using dynamic schema attributes
        existing = db.query(Customer).filter_by(customer_id=customer_id).first()
        if not existing:
            kwargs = {}
            for col in Customer.__table__.columns.keys():
                if col in row and pd.notna(row[col]):
                    val = row[col]
                    import numpy as np
                    if isinstance(val, (np.int64, np.int32)):
                        val = int(val)
                    elif isinstance(val, (np.float64, np.float32)):
                        val = float(val)
                    kwargs[col] = val
                    
            # Map 'name' alias if 'customer_name' is missing
            if "customer_name" not in kwargs and "name" in row and pd.notna(row["name"]):
                kwargs["customer_name"] = str(row["name"])

            if "customer_id" not in kwargs:
                kwargs["customer_id"] = customer_id
                    
            new_cust = Customer(**kwargs)
            db.add(new_cust)
    
    db.commit()
    return {"message": f"Successfully uploaded {len(records)} records.", "filename": file.filename}

@router.get("/status")
def upload_status():
    return {"status": "Upload service running."}
