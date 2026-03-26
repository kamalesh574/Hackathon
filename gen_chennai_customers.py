import csv
import random
from datetime import datetime, timedelta

names = ['Karthik', 'Ramesh', 'Priya', 'Surya', 'Ananya', 'Swathi', 'Siva', 'Bala', 'Balaji', 'Arun', 'Vignesh', 'Raj', 'Sathish', 'Sridevi', 'Meena', 'Saravanan', 'Gokul', 'Prakash', 'Divya', 'Ganesh', 'Kavitha', 'Nandhini', 'Ashok', 'Suresh', 'Deepa']
regions = ['Chennai', 'Coimbatore', 'Madurai', 'Trichy', 'Salem', 'Tirunelveli', 'Erode', 'Vellore']
plans = ['Premium', 'Standard', 'Basic']

cols = ['customer_id', 'customer_name', 'region', 'plan_type', 'subscription_status', 'signup_date', 'onboarding_completion', 'time_to_first_purchase', 'lifecycle_stage', 'reactivation_attempts', 'login_frequency', 'session_duration', 'app_visits', 'pages_viewed', 'cart_activity', 'email_open_rate', 'feature_usage_score', 'last_login_days', 'bounce_rate', 'rage_clicks', 'idle_time', 'feature_adoption_rate', 'feature_dropoff_rate', 'purchase_count', 'total_spend', 'avg_order_value', 'purchase_frequency', 'last_purchase_days', 'payment_failures', 'refund_count', 'lifetime_value', 'mrr', 'discount_frequency', 'cart_abandonment_rate', 'support_tickets', 'issue_resolution_time', 'support_sentiment', 'nps_score', 'rating_given']

with open('chennai_customers_100.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(cols)
    
    for i in range(1, 101):
        cid = f"CUST-{str(i).zfill(4)}"
        name = random.choice(names)
        region = random.choice(regions)
        plan = random.choice(plans)
        signup_dt = datetime.now() - timedelta(days=random.randint(60, 365))
        signup = signup_dt.strftime('%Y-%m-%d')
        
        # Determine strict cohorts
        if i <= 30: # HIGH RISK
            status = 'Churned'
            lifecycle = 'At-Risk'
            onboarding = round(random.uniform(0.1, 0.4), 2)
            ttf = random.randint(15, 60)
            reactivation = random.randint(1, 4)
            login_f = random.randint(0, 3)
            sess = round(random.uniform(1.0, 5.0), 1)
            visits = random.randint(1, 5)
            pages = random.randint(1, 10)
            cart = random.randint(0, 2)
            email = round(random.uniform(0.01, 0.05), 3)
            feat_score = round(random.uniform(0.0, 2.0), 1)
            last_login = random.randint(30, 90)
            bounce = round(random.uniform(0.7, 0.95), 2)
            rage = random.randint(8, 25)
            idle = random.randint(300, 1200)
            f_adopt = round(random.uniform(0.05, 0.2), 2)
            f_drop = round(random.uniform(0.6, 0.9), 2)
            purch = random.randint(1, 3)
            spend = round(random.uniform(100.0, 500.0), 2)
            aov = round(spend / purch, 2) if purch > 0 else 0
            p_freq = random.randint(1, 2)
            last_p = random.randint(45, 120)
            fails = random.randint(2, 6)
            refunds = random.randint(1, 4)
            ltv = round(spend * 1.5, 2)
            mrr = round(random.uniform(9.0, 29.0), 2)
            discount = round(random.uniform(0.5, 1.0), 2)
            cart_abandon = round(random.uniform(0.7, 1.0), 2)
            tickets = random.randint(3, 8)
            resolution = round(random.uniform(48.0, 120.0), 1)
            sentiment = round(random.uniform(-1.0, -0.3), 2)
            nps = random.randint(0, 4)
            rating = random.randint(1, 2)
        elif i <= 70: # MEDIUM RISK
            status = 'Active'
            lifecycle = 'Active'
            onboarding = round(random.uniform(0.5, 0.8), 2)
            ttf = random.randint(5, 14)
            reactivation = random.randint(0, 1)
            login_f = random.randint(5, 15)
            sess = round(random.uniform(6.0, 15.0), 1)
            visits = random.randint(10, 30)
            pages = random.randint(20, 60)
            cart = random.randint(3, 8)
            email = round(random.uniform(0.1, 0.3), 3)
            feat_score = round(random.uniform(3.0, 6.0), 1)
            last_login = random.randint(5, 20)
            bounce = round(random.uniform(0.4, 0.6), 2)
            rage = random.randint(2, 7)
            idle = random.randint(100, 300)
            f_adopt = round(random.uniform(0.3, 0.6), 2)
            f_drop = round(random.uniform(0.3, 0.5), 2)
            purch = random.randint(4, 10)
            spend = round(random.uniform(800.0, 3000.0), 2)
            aov = round(spend / purch, 2)
            p_freq = random.randint(3, 6)
            last_p = random.randint(10, 30)
            fails = random.randint(0, 2)
            refunds = random.randint(0, 1)
            ltv = round(spend * 3.5, 2)
            mrr = round(random.uniform(29.0, 99.0), 2)
            discount = round(random.uniform(0.1, 0.4), 2)
            cart_abandon = round(random.uniform(0.3, 0.6), 2)
            tickets = random.randint(1, 3)
            resolution = round(random.uniform(12.0, 48.0), 1)
            sentiment = round(random.uniform(-0.2, 0.4), 2)
            nps = random.randint(5, 7)
            rating = random.randint(3, 4)
        else: # LOW RISK
            status = 'Active'
            lifecycle = 'Champion'
            onboarding = round(random.uniform(0.9, 1.0), 2)
            ttf = random.randint(1, 4)
            reactivation = 0
            login_f = random.randint(20, 40)
            sess = round(random.uniform(16.0, 45.0), 1)
            visits = random.randint(40, 100)
            pages = random.randint(80, 200)
            cart = random.randint(10, 30)
            email = round(random.uniform(0.4, 0.8), 3)
            feat_score = round(random.uniform(7.0, 10.0), 1)
            last_login = random.randint(0, 3)
            bounce = round(random.uniform(0.1, 0.3), 2)
            rage = random.randint(0, 1)
            idle = random.randint(0, 60)
            f_adopt = round(random.uniform(0.7, 0.95), 2)
            f_drop = round(random.uniform(0.0, 0.2), 2)
            purch = random.randint(15, 50)
            spend = round(random.uniform(5000.0, 20000.0), 2)
            aov = round(spend / purch, 2)
            p_freq = random.randint(8, 20)
            last_p = random.randint(1, 7)
            fails = 0
            refunds = 0
            ltv = round(spend * 5.0, 2)
            mrr = round(random.uniform(199.0, 499.0), 2)
            discount = round(random.uniform(0.0, 0.1), 2)
            cart_abandon = round(random.uniform(0.05, 0.2), 2)
            tickets = random.randint(0, 1)
            resolution = round(random.uniform(1.0, 12.0), 1)
            sentiment = round(random.uniform(0.5, 1.0), 2)
            nps = random.randint(8, 10)
            rating = 5
            
        row = [cid, name, region, plan, status, signup, onboarding, ttf, lifecycle, reactivation, login_f, sess, visits, pages, cart, email, feat_score, last_login, bounce, rage, idle, f_adopt, f_drop, purch, spend, aov, p_freq, last_p, fails, refunds, ltv, mrr, discount, cart_abandon, tickets, resolution, sentiment, nps, rating]
        writer.writerow(row)

print("Mega Synthetic CSV built successfully.")
