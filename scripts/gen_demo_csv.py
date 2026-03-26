import pandas as pd
import numpy as np

def generate_demo_upload(num_records=50):
    np.random.seed(42)
    customer_ids = [f"CUST-{i:04d}" for i in range(1, num_records + 1)]
    regions = np.random.choice(['North America', 'Europe', 'Asia', 'South America'], num_records)
    plan_types = np.random.choice(['Basic', 'Pro', 'Enterprise'], num_records, p=[0.5, 0.3, 0.2])
    
    # Behavior
    login_frequency = np.random.randint(5, 80, num_records)
    session_duration = np.random.randint(15, 250, num_records)
    app_visits = np.random.randint(2, 40, num_records)
    pages_viewed = np.random.randint(20, 400, num_records)
    cart_activity = np.random.randint(0, 15, num_records)
    email_open_rate = np.random.uniform(0.1, 0.9, num_records)
    feature_usage_score = np.random.uniform(2.0, 9.5, num_records)
    last_login_days = np.random.randint(1, 90, num_records) # Some very inactive
    
    # Transactions
    purchase_count = np.random.randint(1, 40, num_records)
    total_spend = np.random.uniform(50.0, 4000.0, num_records)
    avg_order_value = total_spend / purchase_count
    purchase_frequency = np.random.randint(1, 15, num_records)
    last_purchase_days = np.random.randint(1, 150, num_records)
    payment_failures = np.random.randint(0, 4, num_records)
    refund_count = np.random.randint(0, 8, num_records)
    subscription_status = np.random.choice(['Active', 'Expired'], num_records, p=[0.8, 0.2])
    
    df = pd.DataFrame({
        'customer_id': customer_ids,
        'region': regions,
        'plan_type': plan_types,
        'subscription_status': subscription_status,
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
        'refund_count': refund_count
    })
    
    df.to_csv("d:/ChurnSense/demo_upload_set.csv", index=False)
    print(f"Generated {num_records} demo records to d:/ChurnSense/demo_upload_set.csv")

if __name__ == "__main__":
    generate_demo_upload(100)
