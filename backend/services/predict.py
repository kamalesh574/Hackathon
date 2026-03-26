import pandas as pd
import numpy as np
import pickle

def load_model(model_path='ml/artifacts/churn_model.pkl'):
    """Load the trained churn model."""
    with open(model_path, 'rb') as f:
        return pickle.load(f)
        
def load_feature_names(feature_path='ml/artifacts/features.pkl'):
    """Load the trained expected features."""
    with open(feature_path, 'rb') as f:
        return pickle.load(f)

def assign_risk_level(probability):
    """Assign risk level based on probability."""
    if probability <= 0.30:
        return 'Low risk'
    elif probability <= 0.70:
        return 'Medium risk'
    else:
        return 'High risk'

def predict_customer_risk(model, df, feature_names=None):
    """Predict churn probability and assign risk level for a dataset."""
    
    # Ensure correct features are available
    if feature_names is not None:
        missing_cols = set(feature_names) - set(df.columns)
        for c in missing_cols:
            df[c] = 0
        df = df[feature_names]
        
    # Get probabilities
    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(df)[:, 1]
    else:
        probabilities = model.predict(df)
        
    predictions = model.predict(df)
    
    results = pd.DataFrame({
        'churn_prediction': predictions,
        'churn_probability': probabilities
    })
    
    results['risk_level'] = results['churn_probability'].apply(assign_risk_level)
    
    return results
