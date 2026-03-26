from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.db.database import get_db
from backend.models.db_models import Customer, Prediction, Action
from backend.services.predict import load_model, load_feature_names, predict_customer_risk
from backend.services.preprocess import clean_data, encode_features
from backend.services.feature_engineering import build_features
from backend.services.explain import explain_prediction
from backend.services.recommend import recommend_actions
import pandas as pd
import datetime

router = APIRouter(prefix="/predict", tags=["Prediction"])

@router.post("/batch")
def predict_batch(file_path: str = "data/raw/demo_data.csv", db: Session = Depends(get_db)):
    model = load_model()
    features = load_feature_names()
    
    df_raw = pd.read_csv(file_path)
    df_clean = clean_data(df_raw)
    df_encoded, df_clean_full = encode_features(df_clean)
    df_features = build_features(df_encoded)
    
    results = predict_customer_risk(model, df_features, features)
    
    df_final = pd.concat([df_clean_full.reset_index(drop=True), results.reset_index(drop=True), df_features[['customer_value_score']].reset_index(drop=True)], axis=1)
    
    explanations = explain_prediction(df_final)
    df_final['churn_reasons'] = explanations
    
    priorities, recommendations = recommend_actions(df_final)
    df_final['retention_action'] = recommendations
    df_final['action_priority'] = priorities
    
    # Save predictions and actions to DB
    for _, row in df_final.iterrows():
        cid = str(row['customer_id'])
        
        # Save prediction
        existing_pred = db.query(Prediction).filter_by(customer_id=cid).first()
        if existing_pred:
            existing_pred.churn_probability = float(row['churn_probability'])
            existing_pred.risk_level = str(row['risk_level'])
            existing_pred.priority_score = float(row['customer_value_score']) * float(row['churn_probability'])
            existing_pred.churn_reasons = str(row['churn_reasons'])
            existing_pred.prediction_date = datetime.datetime.utcnow()
        else:
            new_pred = Prediction(
                customer_id=cid,
                churn_probability=float(row['churn_probability']),
                risk_level=str(row['risk_level']),
                priority_score=float(row['customer_value_score']) * float(row['churn_probability']),
                churn_reasons=str(row['churn_reasons'])
            )
            db.add(new_pred)
            
        # Save action
        existing_action = db.query(Action).filter_by(customer_id=cid).first()
        if not existing_action:
            new_action = Action(
                customer_id=cid,
                action_type=str(row['retention_action']),
                action_priority=str(row['action_priority'])
            )
            db.add(new_action)
            
    db.commit()
    return {"message": "Batch prediction complete and saved to database."}
