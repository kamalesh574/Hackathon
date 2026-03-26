# ChurnSense SaaS Architecture

## 🏗️ Layers
1. **Frontend**: Multi-page Streamlit Application (`st.navigation`).
2. **Backend API**: FastAPI with modular routers for Analytics, Predictions, Customers, and Campaigns.
3. **Data Persistence**: SQLite using SQLAlchemy ORM.
4. **Intelligence Services**: Rule-based explainers, campaign simulators, and ML inference.
5. **BI Layer**: Automated CSV export pipeline for Power BI connectivity.

## 🚀 Deployment
Run the platform using the master script:
```bash
python run_platform.py
```
This launches the FastAPI server (Port 8000) and the Streamlit UI simultaneously.
