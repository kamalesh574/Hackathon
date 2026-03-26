import streamlit as st
import pandas as pd
from utils_api import get_api

st.title("📑 Reports & Export")
st.markdown("### Business Reporting and Power BI Connectivity")

st.info("Power BI is directly connected to the exported datasets in the reporting layer.")

st.divider()

st.subheader("📊 Performance Reports")
st.write("Generate and download the latest data snapshots for external analysis.")

if st.button("Generate Power BI Export Snapshot"):
    with st.spinner("Writing CSV reporting tables..."):
        res = get_api("/reports/powerbi-export")
        if res:
            st.success("Successfully generated Power BI ready files in `powerbi/exports/`.")
            st.write(f"**Saved to:** {res['path']}")
        else:
            st.error("Report generation failed.")

st.divider()

st.subheader("📥 Direct Downloads")
col1, col2 = st.columns(2)
with col1:
    st.markdown("### Customer Prediction Report")
    st.write("Full dataset containing churn probabilities, risk levels, and retention recommendations.")
    st.button("Download CSV Snapshot") # backend link logic simplified

with col2:
    st.markdown("### Executive Performance PDF")
    st.write("Summary overview for board and leadership review.")
    st.button("Download PDF Pack")
