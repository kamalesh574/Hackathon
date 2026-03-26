import streamlit as st
import pandas as pd
from utils_api import get_api, post_api

st.title("🔔 Alerts Center")
st.markdown("### Real-time Risk Detection")

if st.button("Trigger Alert Review"):
    with st.spinner("Analyzing data for operational anomalies..."):
        post_api("/alerts/trigger")
        st.success("Platform check complete.")

alerts = get_api("/alerts")

if alerts:
    for alert in alerts:
        severity_color = "🔴" if alert['severity'] == "Critical" else ("🟠" if alert['severity'] == "High" else "🟡")
        
        with st.expander(f"{severity_color} {alert['alert_type']}: {alert['message'][:40]}...", expanded=False):
            st.write(f"**Full Message:** {alert['message']}")
            st.write(f"**Severity:** {alert['severity']}")
            st.write(f"**Detected At:** {alert['created_at']}")
            st.button(f"SLA: Response Required", key=alert['id'])
else:
    st.success("✅ System Status: No active alerts detected.")
