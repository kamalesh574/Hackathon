from sklearn.metrics import precision_score, recall_score, f1_score, roc_auc_score, confusion_matrix
import numpy as np

def evaluate_model(model, X_test, y_test):
    """Evaluate a trained model."""
    predictions = model.predict(X_test)
    
    # Needs probabilities for ROC-AUC
    if hasattr(model, "predict_proba"):
        probabilities = model.predict_proba(X_test)[:, 1]
    else:
        # Fallback to binary predictions
        probabilities = predictions
        
    metrics = {
        'precision': precision_score(y_test, predictions, zero_division=0),
        'recall': recall_score(y_test, predictions, zero_division=0),
        'f1': f1_score(y_test, predictions, zero_division=0),
    }
    
    # Try getting ROC-AUC
    try:
        metrics['roc_auc'] = roc_auc_score(y_test, probabilities)
    except Exception:
        metrics['roc_auc'] = np.nan
        
    cm = confusion_matrix(y_test, predictions)
    
    for k, v in metrics.items():
        print(f"  {k}: {v:.4f}")
        
    print(f"  Confusion Matrix:\n{cm}")
    
    return metrics
