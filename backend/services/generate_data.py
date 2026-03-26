import pandas as pd
import numpy as np
import os

def generate_demo_data(num_records=1000):
    np.random.seed(42)
    
    # customer profile
    customer_ids = [f"CUST-{i:04d}" for i in range(1, num_records + 1)]
    customer_since = pd.date_range(end=pd.Timestamp.now(), periods=num_records, freq='D')
    regions = np.random.choice(['North America', 'Europe', 'Asia', 'South America'], num_records)
    plan_types = np.random.choice(['Basic', 'Pro', 'Enterprise'], num_records, p=[0.5, 0.3, 0.2])
    
    # behavior features
    login_frequency = np.random.randint(1, 100, num_records)
    session_duration = np.random.randint(10, 300, num_records).astype(float) # minutes per month
    app_visits = np.random.randint(1, 50, num_records)
    pages_viewed = np.random.randint(10, 500, num_records)
    cart_activity = np.random.randint(0, 20, num_records)
    email_open_rate = np.random.uniform(0.0, 1.0, num_records)
    feature_usage_score = np.random.uniform(1.0, 10.0, num_records)
    last_login_days = np.random.randint(0, 60, num_records)
    
    # transaction features
    purchase_count = np.random.randint(1, 50, num_records).astype(float)
    total_spend = np.random.uniform(10.0, 5000.0, num_records)
    avg_order_value = total_spend / purchase_count
    purchase_frequency = np.random.randint(1, 20, num_records)
    last_purchase_days = np.random.randint(1, 120, num_records)
    payment_failures = np.random.randint(0, 5, num_records)
    refund_count = np.random.randint(0, 10, num_records)
    subscription_status = np.random.choice(['Active', 'Expired', ''], num_records, p=[0.75, 0.2, 0.05])
    
    # creating the target variable 'churn' conceptually based on some of the features adding risk
    # Higher risk -> likely to churn
    churn_prob = (
        (last_login_days / 60) * 0.3 + 
        (last_purchase_days / 120) * 0.2 + 
        (payment_failures / 5) * 0.2 + 
        (refund_count / 10) * 0.1 +
        ((1 - email_open_rate) * 0.1) +
        ((10 - feature_usage_score) / 10) * 0.1
    )
    
    churn_prob = np.clip(churn_prob, 0, 1)
    churn_label = (np.random.uniform(0, 1, num_records) < churn_prob).astype(int)
    
    # introduce some missing values to test preprocessing
    for i in range(int(num_records * 0.05)):
        idx = np.random.randint(0, num_records)
        session_duration[idx] = np.nan
        
        idx2 = np.random.randint(0, num_records)
        purchase_count[idx2] = np.nan
    
    df = pd.DataFrame({
        'customer_id': customer_ids,
        'customer_since': customer_since,
        'region': regions,
        'plan_type': plan_types,
        'login_frequency': login_frequency,
        'session_duration': session_duration,
        'app_visits': app_visits,
        'pages_viewed': pages_viewed,
        'cart_activity': cart_activity,
        'email_open_rate': email_open_rate,
        'feature_usage_score': feature_usage_score,
        'last_login_days': last_login_days,
        'purchase_count': purchase_count,
        'total_spend': total_spend,
        'avg_order_value': avg_order_value,
        'purchase_frequency': purchase_frequency,
        'last_purchase_days': last_purchase_days,
        'payment_failures': payment_failures,
        'refund_count': refund_count,
        'subscription_status': subscription_status,
        'churn': churn_label
    })
    
    return df

if __name__ == '__main__':
    # Ensure directory exists
    os.makedirs('data/raw', exist_ok=True)
    df = generate_demo_data(1000)
    output_path = 'data/raw/demo_data.csv'
    df.to_csv(output_path, index=False)
    print(f"Generated synthetic data: {output_path} with {len(df)} records.")
