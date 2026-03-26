from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.db.database import engine
from backend.models import db_models

from backend.api import upload, predict, customers, analytics, reports, campaigns, alerts

db_models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ChurnSense SaaS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok", "service": "ChurnSense API"}

app.include_router(upload.router)
app.include_router(predict.router)
app.include_router(customers.router)
app.include_router(analytics.router)
app.include_router(reports.router)
app.include_router(campaigns.router)
app.include_router(alerts.router)

