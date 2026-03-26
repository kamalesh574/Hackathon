import streamlit as st
from utils_api import post_api

st.title("🎯 Campaign Simulator")
st.markdown("### Retention Strategy Planning")

st.sidebar.markdown("### Target Parameters")
target_group = st.sidebar.selectbox("Target Group", ["All Risk Categories", "High Risk", "Medium Risk"])
campaign_type = st.sidebar.selectbox("Campaign Type", ["Email Outreach", "Discount / Coupon", "Support Callback"])
discount = st.sidebar.slider("Discount Percentage (%)", 0, 50, 15)
retention_rate = st.sidebar.slider("Expected Retention Rate (%)", 0, 100, 25) / 100.0
budget = st.sidebar.number_input("Campaign Budget ($)", 0, 100000, 5000)

if st.button("Run Simulation"):
    with st.spinner("Processing simulation..."):
        config = {
            "target_group": target_group,
            "campaign_type": campaign_type,
            "discount_percent": float(discount),
            "expected_retention_rate": float(retention_rate),
            "budget": float(budget)
        }
        res = post_api("/campaigns/simulate", data=config)
        
        if res:
            st.divider()
            c1, c2, c3 = st.columns(3)
            c1.metric("Customers Targeted", res['targeted_customers'])
            c2.metric("Expected Saved", res['expected_saved'])
            c3.metric("Revenue Protected", f"${res['revenue_protected']:,.2f}")
            
            st.markdown(f"### Estimated Campaign Cost: **${res['estimated_cost']:,.2f}**")
            st.markdown(f"### Estimated ROI: **{res['roi_percent']}%**")
            
            if res['roi_percent'] > 0:
                st.success("✅ This campaign is projected to be profitable.")
            else:
                st.error("⚠️ This campaign projected cost exceeds the protected revenue.")
        else:
            st.error("Simulation engine failed. Is the API running?")
