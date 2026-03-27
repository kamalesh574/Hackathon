from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
import datetime
from backend.db.database import Base
class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, unique=True, index=True)
    
    # Profile & Lifecycle
    customer_name = Column(String, nullable=True)
    email = Column(String, nullable=True)
    region = Column(String)
    plan_type = Column(String)
    subscription_status = Column(String)
    signup_date = Column(String, nullable=True)
    onboarding_completion = Column(Float, default=0.0)
    time_to_first_purchase = Column(Integer, default=0)
    lifecycle_stage = Column(String, default="New")
    reactivation_attempts = Column(Integer, default=0)
    
    # Engagement / Behavior
    login_frequency = Column(Integer, default=0)
    session_duration = Column(Float, default=0.0)
    app_visits = Column(Integer, default=0)
    pages_viewed = Column(Integer, default=0)
    cart_activity = Column(Integer, default=0)
    email_open_rate = Column(Float, default=0.0)
    feature_usage_score = Column(Float, default=0.0)
    last_login_days = Column(Integer, default=0)
    bounce_rate = Column(Float, default=0.0)
    rage_clicks = Column(Integer, default=0)
    idle_time = Column(Integer, default=0)
    feature_adoption_rate = Column(Float, default=0.0)
    feature_dropoff_rate = Column(Float, default=0.0)
    
    # Transaction / Revenue
    purchase_count = Column(Float, default=0.0)
    total_spend = Column(Float, default=0.0)
    avg_order_value = Column(Float, default=0.0)
    purchase_frequency = Column(Integer, default=0)
    last_purchase_days = Column(Integer, default=0)
    payment_failures = Column(Integer, default=0)
    refund_count = Column(Integer, default=0)
    lifetime_value = Column(Float, default=0.0)
    mrr = Column(Float, default=0.0)
    discount_frequency = Column(Float, default=0.0)
    cart_abandonment_rate = Column(Float, default=0.0)
    
    # Support & Satisfaction
    support_tickets = Column(Integer, default=0)
    issue_resolution_time = Column(Float, default=0.0)
    support_sentiment = Column(Float, default=0.0)
    nps_score = Column(Integer, default=0)
    rating_given = Column(Integer, default=0)
    
    predictions = relationship("Prediction", back_populates="customer")
    actions = relationship("Action", back_populates="customer")

class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, ForeignKey("customers.customer_id"))
    churn_probability = Column(Float)
    risk_level = Column(String)
    priority_score = Column(Float)
    churn_reasons = Column(Text)
    prediction_date = Column(DateTime, default=datetime.datetime.utcnow)
    
    customer = relationship("Customer", back_populates="predictions")

class Action(Base):
    __tablename__ = "actions"
    
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, ForeignKey("customers.customer_id"))
    action_type = Column(String)
    action_priority = Column(String)
    owner = Column(String, default="Unassigned")
    status = Column(String, default="Pending")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    customer = relationship("Customer", back_populates="actions")

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    alert_type = Column(String)
    message = Column(Text)
    severity = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class CampaignResult(Base):
    __tablename__ = "campaign_results"
    
    id = Column(Integer, primary_key=True, index=True)
    campaign_name = Column(String)
    targeted_count = Column(Integer)
    expected_saved = Column(Integer)
    revenue_protected = Column(Float)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
