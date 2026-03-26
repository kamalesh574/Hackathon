import pandas as pd

def create_engagement_score(df):
    f_login = df['login_frequency'] if 'login_frequency' in df.columns else pd.Series([0]*len(df))
    session = df['session_duration'] if 'session_duration' in df.columns else pd.Series([1.0]*len(df))
    nps = df['nps_score'] if 'nps_score' in df.columns else pd.Series([5]*len(df))
    email = df['email_open_rate'] if 'email_open_rate' in df.columns else pd.Series([0.0]*len(df))
    
    engagement = (f_login * session) * (nps / 10) + (email * 100)
    df['engagement_score'] = (engagement / (engagement.max() if engagement.max() > 0 else 1)) * 100
    return df

def create_value_score(df):
    f_spend = df['total_spend'] if 'total_spend' in df.columns else pd.Series([0.0]*len(df))
    mrr = df['mrr'] if 'mrr' in df.columns else pd.Series([0.0]*len(df))
    ltv = df['lifetime_value'] if 'lifetime_value' in df.columns else pd.Series([0.0]*len(df))
    
    val = f_spend + (mrr * 12) + ltv
    df['customer_value_score'] = (val / (val.max() if val.max() > 0 else 1)) * 100
    return df

def create_friction_score(df):
    f_fail = df['payment_failures'] if 'payment_failures' in df.columns else pd.Series([0]*len(df))
    f_refund = df['refund_count'] if 'refund_count' in df.columns else pd.Series([0]*len(df))
    rage = df['rage_clicks'] if 'rage_clicks' in df.columns else pd.Series([0]*len(df))
    bounce = df['bounce_rate'] if 'bounce_rate' in df.columns else pd.Series([0.0]*len(df))
    tickets = df['support_tickets'] if 'support_tickets' in df.columns else pd.Series([0]*len(df))
    sentiment = df['support_sentiment'] if 'support_sentiment' in df.columns else pd.Series([1.0]*len(df))
    abandon = df['cart_abandonment_rate'] if 'cart_abandonment_rate' in df.columns else pd.Series([0.0]*len(df))
    
    df['friction_score'] = (f_fail * 5) + (f_refund * 3) + (rage * 1.5) + (bounce * 25) + (tickets * 4) + ((1 - sentiment) * 10) + (abandon * 20)
    return df

def create_adoption_score(df):
    adopt = df['feature_adoption_rate'] if 'feature_adoption_rate' in df.columns else pd.Series([0.0]*len(df))
    onboarding = df['onboarding_completion'] if 'onboarding_completion' in df.columns else pd.Series([0.0]*len(df))
    
    score = (adopt * 100) + (onboarding * 100)
    df['adoption_score'] = (score / (score.max() if score.max() > 0 else 1)) * 100
    return df

def build_features(df):
    """Run all feature engineering steps."""
    df = create_engagement_score(df)
    df = create_value_score(df)
    df = create_friction_score(df)
    df = create_adoption_score(df)
    return df

if __name__ == '__main__':
    # Test on processed data
    try:
        df = pd.read_csv('data/processed/model_ready_data.csv')
        df = build_features(df)
        df.to_csv('data/processed/model_ready_data_engineered.csv', index=False)
        print("Feature engineering complete. Saved to data/processed/model_ready_data_engineered.csv")
    except Exception as e:
        print(f"Make sure to run preprocessing first. Error: {e}")
