import streamlit as st

st.title("⚙️ Platform Settings")
st.markdown("### Admin & Configuration Control")

st.divider()

st.subheader("🛠️ Threshold Configuration")
churn_thresh = st.slider("High Risk Churn Probability Threshold", 0.0, 1.0, 0.7)
st.button("Update Model Thresholds")

st.divider()

st.subheader("🌍 Regional Settings")
st.multiselect("Enable Regions", ["North America", "Europe", "Asia", "South America"], default=["Europe", "North America"])

st.divider()

st.subheader("🔔 Alerting & Notifications")
st.checkbox("Enable Email Alerts for Critical Churn Spikes", value=True)
st.checkbox("Enable Priority Outreach Notifications", value=True)

st.divider()

st.subheader("🔗 API & Integrations")
st.text_input("FastAPI Endpoint", value="http://127.0.0.1:8000")
st.text_input("Power BI Workspace ID", placeholder="Enter ID...")
st.button("Test Connection")
