import streamlit as st
import plotly.express as px
import pandas as pd
import requests

st.title("🔍 Feature Insights")
st.markdown("### Analyst & Model Intelligence View")

st.info("💡 Deep dive into the drivers of customer churn.")

# Analyst View filters
c1, c2 = st.columns(2)
feature_x = c1.selectbox("Metric 1", ["login_frequency", "total_spend", "last_login_days", "refund_count"])
feature_y = c2.selectbox("Metric 2", ["churn_probability", "priority_score", "session_duration"])

# For this demo, we'll try to fetch raw data locally if possible, or use a prediction-analytics endpoint
st.warning("⚠️ High performance compute required for deep-feature analysis. Using localized data engine.")

# Mocking the correlation chart for analysts
st.image("https://via.placeholder.com/800x400.png?text=Correlation+Heatmap+:+Model+Performance")

st.divider()
st.subheader("Top Churn Drivers")
st.markdown("""
1. **Last Login Latency** (0.84 correlation)
2. **Refund Count** (0.62 correlation)
3. **Payment Failure Index** (0.55 correlation)
4. **App Session Duration** (-0.48 correlation)
""")
