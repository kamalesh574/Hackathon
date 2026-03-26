import pandas as pd
import numpy as np
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from evaluate import evaluate_model

def train_all_models(X_train, y_train):
    """Train multiple models to compare."""
    models = {
        'Logistic Regression': LogisticRegression(max_iter=1000, random_state=42),
        'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
        'XGBoost': XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
    }
    
    trained_models = {}
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train, y_train)
        trained_models[name] = model
        
    return trained_models

def train_and_evaluate(data_path):
    # Load featured data
    df = pd.read_csv(data_path)
    
    # We should exclude the target feature from X
    if 'churn' not in df.columns:
        raise ValueError("Target variable 'churn' not found in dataset.")
        
    y = df['churn']
    X = df.drop(columns=['churn'])
    
    # Fill any remaining NaNs 
    X = X.fillna(0)
    
    # Train test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    trained_models = train_all_models(X_train, y_train)
    
    best_model = None
    best_f1 = 0
    best_name = ""
    
    # Evaluate
    print("\n--- Model Evaluation ---")
    for name, model in trained_models.items():
        print(f"\n{name}:")
        metrics = evaluate_model(model, X_test, y_test)
        
        # Consider F1 score to choose the best model
        if metrics['f1'] > best_f1:
            best_f1 = metrics['f1']
            best_model = model
            best_name = name
            
    print(f"\nBest model selected: {best_name} (F1 Score: {best_f1:.4f})")
    
    # Save best model
    os.makedirs('models', exist_ok=True)
    with open('models/churn_model.pkl', 'wb') as f:
        pickle.dump(best_model, f)
    
    # Additionally save the expected feature columns
    with open('models/features.pkl', 'wb') as f:
        pickle.dump(list(X.columns), f)
        
    print("Model and features saved in 'models/' directory.")
    return best_model

if __name__ == '__main__':
    train_and_evaluate('data/processed/model_ready_data_engineered.csv')
