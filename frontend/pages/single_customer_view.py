import streamlit as st
from utils_api import get_api

st.title("👤 Customer 360 Profile")
st.markdown("### Support & Success View")

customer_id = st.text_input("Search Customer ID (e.g., CUST-0001):")

if customer_id:
    data = get_api(f"/customers/{customer_id}")
    
    if data:
        profile = data['profile']
        pred = data['prediction']
        action = data['action']
        
        c1, c2, c3 = st.columns(3)
        with c1:
            st.metric("Risk Level", pred['risk_level'] if pred else "N/A")
        with c2:
            st.metric("Churn Prob.", f"{pred['churn_probability']:.2f}" if pred else "N/A")
        with c3:
            st.metric("Priority Score", f"{pred['priority_score']:.1f}" if pred else "N/A")
            
        st.divider()
        
        col1, col2 = st.columns(2)
        with col1:
            st.subheader("Customer Details")
            st.write(f"**Region:** {profile['region']}")
            st.write(f"**Plan:** {profile['plan_type']}")
            st.write(f"**Total Spend:** ${profile['total_spend']:,.2f}")
            st.write(f"**Last Login:** {profile['last_login_days']} days ago")
            
        with col2:
            st.subheader("💡 Intelligence & Recommendations")
            if pred:
                st.markdown("**Key Churn Factors:**")
                for reason in pred['churn_reasons'].split(';'):
                    st.write(f"- {reason.strip()}")
                
                st.markdown("**Actionable Next Step:**")
                st.success(action['action_type'] if action else "No action assigned")
            else:
                st.info("No intelligence data for this customer yet.")
                
        st.divider()
        st.subheader("Action History & Notes")
        st.text_area("Support Notes", placeholder="Add context about your outreach here...")
        st.button("Update Case Status")
        
    else:
        st.error("Customer not found in the platform database.")
