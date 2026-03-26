
# ChurnSense 📈
An AI-powered customer churn prediction and retention platform that detects at-risk customers using behavior and transaction data, explains the causes, and recommends actions to retain them.

## 🚀 Features
1. **Explainability Engine:** Identifies *why* a customer is at risk using rule-based and predictive models.
2. **Recommendation Engine:** Generates personalized retention actions.
3. **Machine Learning:** Compares Logistic Regression, Random Forest, and XGBoost models.
4. **Dashboard:** Built with Streamlit for a fast, enterprise-like user experience.

## 📂 Project Structure
```text
churnsense/
├── data/
│   ├── raw/
│   └── processed/
├── models/
│   ├── churn_model.pkl
│   └── encoder.pkl
├── src/
│   ├── preprocess.py
│   ├── feature_engineering.py
│   ├── train.py
│   ├── predict.py
│   ├── evaluate.py
│   ├── explain.py
│   └── recommend.py
├── app/
│   └── streamlit_app.py
├── notebooks/
│   └── experimentation.ipynb
├── requirements.txt
└── README.md
```

## 🛠️ Setup Instructions
1. Clone the repository and navigate to `ChurnSense`.
2. Install dependencies:
```bash
pip install -r requirements.txt
```
3. Generate synthetic data, preprocess it, engineer features, and train the model:
```bash
python src/generate_data.py
python src/preprocess.py
python src/feature_engineering.py
python src/train.py
```
4. Run the application:
```bash
streamlit run app/streamlit_app.py
```

## 📊 Modules
- **Data Ingestion** (Data generation script and Streamlit CSV uploader)
- **Data Preprocessing** (Missing value imputation and encoding)
- **Feature Engineering** (Engagement, Value, & Friction scores)
- **Engines** (Prediction, Explainers, and Retention Actions)
- **Dashboard** (Executive stats, Table Views, Single User Searches)
>>>>>>> 37d786c6 (Churn Detection)
