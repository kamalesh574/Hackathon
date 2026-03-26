import pandas as pd

def get_top_reasons(row):
    """Rule-based explanation engine returning top churn reasons."""
    reasons = []
    
    # Advanced Telemetry Rule Thresholds
    if row.get('rage_clicks', 0) > 10:
        reasons.append("High application friction (rage clicks)")
        
    if row.get('nps_score', 10) < 6:
        reasons.append("Detractor brand sentiment (low NPS)")
        
    if row.get('cart_abandonment_rate', 0.0) > 0.5:
        reasons.append("Purchasing hesitation (high cart abandonment)")
        
    if row.get('bounce_rate', 0.0) > 0.6:
        reasons.append("Severe navigation drop-off (high bounce rate)")
        
    if row.get('support_sentiment', 1.0) < 0:
        reasons.append("Negative support interactions (sentiment analysis)")
        
    if row.get('feature_dropoff_rate', 0.0) > 0.5:
        reasons.append("High advanced-feature abandonment")
        
    if row.get('last_login_days', 0) > 30:
        reasons.append("Prolonged platform inactivity (>30 days)")
        
    if row.get('refund_count', 0) > 1:
        reasons.append("Consistent product dissatisfaction (high refunds)")
        
    if row.get('payment_failures', 0) > 1:
        reasons.append("Recurring payment gateway friction")
        
    if row.get('session_duration', 100) < 5:
        reasons.append("Critically low engagement duration")
        
    # Return at most 3 reasons
    if not reasons:
        reasons.append("No critical risk factors identified")
        
    return reasons[:3]

def explain_prediction(df):
    """Generate explanations for a dataframe partition."""
    explanations = []
    for _, row in df.iterrows():
        reasons = get_top_reasons(row)
        explanations.append("; ".join(reasons))
        
    return explanations
