import streamlit as st
import pandas as pd
from utils_api import post_api

st.title("🚀 Upload Data Pipeline")
st.markdown("### Enterprise Data Ingestion")

# Load template for download
try:
    with open("data/template_customers.csv", "rb") as f:
        template_bytes = f.read()
    st.download_button(
        label="📥 Download the Template CSV for correct column mapping.",
        data=template_bytes,
        file_name="churnsense_template.csv",
        mime="text/csv",
    )
except Exception:
    st.info("💡 Ensure `data/template_customers.csv` exists for the template download.")

uploaded_file = st.file_uploader("Upload Customer Behavior & Transaction Data", type=["csv"])

if uploaded_file:
    if st.button("Initialize Data Processing"):
        with st.spinner("Uploading and Cleaning..."):
            files = {"file": uploaded_file}
            res = post_api("/upload/customers", files=files)
            
            if res:
                st.success(res['message'])
                
                with st.spinner("Running ML Risk Engine..."):
                    # We trigger batch prediction
                    pred_res = post_api("/predict/batch")
                    if pred_res:
                        st.balloons()
                        st.success("Platform updated with latest predictions and retention actions.")
                        if st.button("View Predictions"):
                            st.switch_page("pages/customer_risk_table.py")
                    else:
                        st.error("Prediction engine failed to run.")
            else:
                st.error("Upload failed. Check API status.")
