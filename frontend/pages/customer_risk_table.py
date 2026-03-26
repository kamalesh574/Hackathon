import streamlit as st
import pandas as pd
from utils_api import get_api

st.title("📋 Customer Risk Table")
st.markdown("### Operational Action Queue")

st.sidebar.markdown("### Filters")
risk_filter = st.sidebar.multiselect("Risk Level", ["High risk", "Medium risk", "Low risk"], default=["High risk", "Medium risk"])

# Fetch Priority Customers
priority_customers = get_api("/customers/priority")

if priority_customers:
    df = pd.DataFrame(priority_customers)
    
    # Filter locally for demo simplicity or use API query params
    if risk_filter:
        df = df[df['risk_level'].isin(risk_filter)]
        
    st.subheader("High Priority Action Items")
    st.dataframe(
        df[['customer_id', 'churn_probability', 'risk_level', 'priority_score', 'churn_reasons']]
        .sort_values(by='priority_score', ascending=False)
        .style.applymap(lambda x: 'color: #ff4b4b; font-weight: bold' if x == 'High risk' else ('color: #f0a500' if x == 'Medium risk' else 'color: #00cc96'), subset=['risk_level'])
    )
    
    st.download_button(
        label="📥 Download Retention Report (CSV)",
        data=df.to_csv(index=False).encode('utf-8'),
        file_name="retention_report.csv",
        mime='text/csv'
    )
else:
    st.info("No predictions found in the database. Run the prediction engine to populate this list.")
