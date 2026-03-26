import sys
import pandas as pd
import numpy as np
sys.path.append('d:/ChurnSense')

from backend.db.database import SessionLocal
from backend.models.db_models import Customer

db = SessionLocal()
df = pd.read_csv('d:/ChurnSense/chennai_customers_100.csv')

# Replace NaN with None
df = df.replace({np.nan: None})
records = df.to_dict(orient="records")

try:
    for row in records[:2]:
        kwargs = {}
        for col in Customer.__table__.columns.keys():
            if col in row and row[col] is not None:
                # Cast numpy types to vanilla python types
                val = row[col]
                if isinstance(val, (np.int64, np.int32)):
                    val = int(val)
                elif isinstance(val, (np.float64, np.float32)):
                    val = float(val)
                kwargs[col] = val

        if "customer_id" not in kwargs:
            kwargs["customer_id"] = str(row.get("customer_id", ""))
            
        print("Inserting:", kwargs)
        new_cust = Customer(**kwargs)
        db.add(new_cust)
        
    db.commit()
    print("Success")
except Exception as e:
    print("Error:", repr(e))
