import pandas as pd

def assign_priority(risk_level, value_score):
    """Determine retention priority based on risk and value."""
    # Assuming value_score is 0-100
    if risk_level == 'High risk':
        if value_score > 50:
            return 'Urgent Outreach'
        else:
            return 'Automated Email/Discount'
    elif risk_level == 'Medium risk':
        return 'Nurture Campaign'
    else:
        return 'Monitor Only'

def generate_recommendation(reasons, risk_level):
    """Generate specific action based on the top churn reason."""
    if risk_level == 'Low risk':
        return "No immediate action required"
    
    reason_str = (" ".join(reasons)).lower()
    
    if "inactivity" in reason_str:
        return "Send re-engagement email with product updates"
    elif "payment friction" in reason_str:
        return "Prompt payment recovery and check billing details"
    elif "dissatisfaction" in reason_str or "refund" in reason_str:
        return "Assign customer support follow-up call"
    elif "expired" in reason_str or "subscription" in reason_str:
        return "Send subscription renewal offer / discount"
    elif "engagement" in reason_str:
        return "Send onboarding/tutorial tips to increase usage"
    else:
        return "Send personalized retention offer (e.g., 20% discount)"

def recommend_actions(df):
    """Generate recommendations for all users in dataframe."""
    recommendations = []
    priorities = []
    
    for _, row in df.iterrows():
        risk_level = row.get('risk_level', 'Low risk')
        value_score = row.get('customer_value_score', 0)
        reasons_str = row.get('churn_reasons', "")
        reasons_list = reasons_str.split(";") if pd.notnull(reasons_str) else []
        
        priority = assign_priority(risk_level, value_score)
        rec = generate_recommendation(reasons_list, risk_level)
        
        priorities.append(priority)
        recommendations.append(rec)
        
    return priorities, recommendations
