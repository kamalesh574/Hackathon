import pandas as pd
import numpy as np
import os

def load_data(file_path):
    """Load raw data."""
    return pd.read_csv(file_path)

def clean_data(df):
    """Handle missing values and duplicates."""
    df = df.drop_duplicates()
    
    # Example logic: empty session_duration -> replace with median
    if 'session_duration' in df.columns:
        median_duration = df['session_duration'].median()
        df['session_duration'] = df['session_duration'].fillna(median_duration)
        
    # Example logic: empty purchase_count -> replace with 0
    if 'purchase_count' in df.columns:
        df['purchase_count'] = df['purchase_count'].fillna(0)
    
    # Fill any other remaining nulls in numeric columns with median
    for col in df.select_dtypes(include=['number']).columns:
        if df[col].isnull().sum() > 0:
            df[col] = df[col].fillna(df[col].median())
            
    return df

def encode_features(df):
    """Encode categorical columns."""
    # Convert subscription_status: Active = 1, Expired = 0, others (missing) = 0
    if 'subscription_status' in df.columns:
        df['subscription_status'] = df['subscription_status'].apply(
            lambda x: 1 if pd.notnull(x) and x.strip().lower() == 'active' else 0
        )
    
    # Encode other categorical columns using one-hot encoding or mapping
    categorical_cols = ['region', 'plan_type']
    for col in categorical_cols:
        if col in df.columns:
            # For simplicity in hackathon, use pandas get_dummies
            df = pd.get_dummies(df, columns=[col], drop_first=True)
            
    # For models like XGBoost, ensure bools are ints
    for col in df.columns:
        if df[col].dtype == 'bool':
            df[col] = df[col].astype(int)
            
    # Drop columns that are not useful for models
    cols_to_drop = ['customer_id', 'customer_name', 'customer_segment', 'customer_since']
    df_model = df.drop(columns=[col for col in cols_to_drop if col in df.columns])
    
    return df_model, df

def prepare_for_model(file_path):
    """Wrapper to prepare data for modeling."""
    df_raw = load_data(file_path)
    df_clean = clean_data(df_raw)
    df_encoded, df_clean_full = encode_features(df_clean)
    
    # Save processed data
    os.makedirs('data/processed', exist_ok=True)
    df_encoded.to_csv('data/processed/model_ready_data.csv', index=False)
    df_clean_full.to_csv('data/processed/clean_data.csv', index=False)
    
    return df_encoded, df_clean_full

if __name__ == '__main__':
    print("Preprocessing data...")
    df_encoded, df_clean = prepare_for_model('data/raw/demo_data.csv')
    print(f"Processed shape: {df_encoded.shape}")
