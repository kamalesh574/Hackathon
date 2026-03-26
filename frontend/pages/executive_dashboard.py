import streamlit as st
import plotly.express as px
import pandas as pd
from utils_api import get_api

st.title("📊 Executive Dashboard")
st.markdown("### Business Strategy & Churn Overview")

# Role Switcher Feel
role = st.sidebar.selectbox("Switch View", ["Business View", "Analyst View", "Support View"])
if role == "Business View":
    st.info("💡 You are currently viewing optimized insights for Business Leaders.")

# Fetch KPIs from API
summary = get_api("/analytics/executive-summary")
rev_at_risk = get_api("/analytics/revenue-at-risk")

if summary and rev_at_risk:
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Total Customers", f"{summary['total_customers']:,}")
    c2.metric("High-Risk Segments", f"{summary['high_risk_customers']:,}")
    c3.metric("Est. Churn Rate", f"{summary['estimated_churn_rate']}%")
    c4.metric("Revenue at Risk", f"${rev_at_risk['revenue_at_risk']:,.2f}")

    # Charts
    dist = get_api("/analytics/risk-distribution")
    if dist:
        df_dist = pd.DataFrame(dist)
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("Risk Distribution")
            fig = px.pie(df_dist, names='risk_level', values='count', hole=0.4,
                         color='risk_level', color_discrete_map={'High risk': '#ff4b4b', 'Medium risk': '#f0a500', 'Low risk': '#00cc96'})
            fig.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)', font=dict(color='white'))
            st.plotly_chart(fig, use_container_width=True)
            
        with col2:
            st.subheader("Revenue at Risk by Region")
            # Mocking more detailed BI logic
            st.write("This section connects to the BI Layer (Power BI integration ready).")
            st.image("https://via.placeholder.com/400x250.png?text=Revenue+Trend+BI+Mockup")

else:
    st.warning("No data available. Please upload and run predictions first.")
    if st.button("Go to Upload Page"):
        st.switch_page("pages/upload_data.py")
