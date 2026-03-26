import streamlit as st
import sys
import os

# Ensure backend imports work if needed locally in streamlit, though usually SaaS uses requests to API
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

st.set_page_config(page_title="ChurnSense Platform", layout="wide", page_icon="📈")

# Premium Glassmorphism UI CSS
st.markdown("""
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&display=swap');
html, body, [class*="css"] { font-family: 'Inter', sans-serif; }
.stApp { background: radial-gradient(circle at 10% 20%, rgb(20, 24, 38) 0%, rgb(13, 14, 21) 100%); }
div[data-testid="metric-container"] {
    background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3); backdrop-filter: blur(10px);
    border-radius: 12px; padding: 20px; transition: transform 0.3s ease-in-out;
}
div[data-testid="metric-container"]:hover {
    transform: translateY(-5px); border: 1px solid rgba(138, 43, 226, 0.5);
}
div.stButton > button {
    background: linear-gradient(135deg, #8a2be2, #4b0082) !important;
    border: none !important; border-radius: 8px !important; color: white !important;
    font-weight: 600 !important; transition: all 0.4s ease !important;
}
div.stButton > button:hover {
    transform: scale(1.05) !important; background: linear-gradient(135deg, #9b4cf0, #6110a1) !important;
}
h1 {
    background: -webkit-linear-gradient(45deg, #e0c3fc, #8ec5fc);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    font-weight: 800 !important;
}
h2, h3, h4 { color: #e2e8f0; }
[data-testid="stDataFrame"] { border-radius: 12px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1); }
</style>
""", unsafe_allow_html=True)

# Define multipage navigation
pg = st.navigation([
    st.Page("pages/executive_dashboard.py", title="Executive Dashboard", icon="📊"),
    st.Page("pages/customer_risk_table.py", title="Customer Risk Table", icon="📋"),
    st.Page("pages/single_customer_view.py", title="Customer 360 Profile", icon="👤"),
    st.Page("pages/feature_insights.py", title="Feature Insights", icon="🔍"),
    st.Page("pages/campaign_simulator.py", title="Campaign Simulator", icon="🎯"),
    st.Page("pages/alerts_center.py", title="Alerts Center", icon="🔔"),
    st.Page("pages/reports.py", title="Reports & Export", icon="📑"),
    st.Page("pages/upload_data.py", title="Upload Data Pipeline", icon="🚀"),
])

# Run the app router
pg.run()
