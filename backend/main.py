from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
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

class EmailRequest(BaseModel):
    email: str
    name: str
    risk: float

@app.post("/send-email")
def send_email(data: EmailRequest):
    # ! IMPORTANT: Replace with your actual Gmail and App Password for your live demo!
    sender_email = "kamal574.dev@gmail.com"
    app_password = "pnsh uccu dupu ttmx"  

    subject = "Important: We Value You ❤️"
    offer = "20% discount" if data.risk > 0.8 else "10% discount"
    
    body = f"""
    Hi {data.name},

    We noticed that your recent activity has decreased, and we truly value you as our customer.

    As a token of appreciation, we are offering you a special retention benefit: a {offer} 🎁.

    Click here to explore: https://churnsense.ai/claim

    Regards,
    The ChurnSense Executive Team
    """

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = sender_email
    msg["To"] = data.email

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, app_password)
            server.send_message(msg)
        return {"status": "Email sent successfully!"}
    except Exception as e:
        return {"status": "Error", "detail": str(e)}
