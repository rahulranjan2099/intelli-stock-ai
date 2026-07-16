import pandas as pd
from datetime import datetime
from utils.config import (
    FEATURE_COLUMNS, 
    TARGET_COLUMN,
    MODEL_PATH,
) 

import joblib

from xgboost import XGBRegressor

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    median_absolute_error,
    mean_absolute_percentage_error,
    r2_score,
)

from training.encoders import fit_encoders, transform_dataframe

from training.visualization import plot_actual_vs_predicted, plot_feature_importance

from training.explainability import explain_model

def prepare_training_data(df):

    return (
        df.dropna()
          .reset_index(drop=True)
    )

def validate_training_data(df):

    print("\n========== Dataset Summary ==========")

    print(f"Rows    : {len(df)}")
    print(f"Columns : {len(df.columns)}")

    print("\nMissing Values")

    print(df.isnull().sum())

    print("\nData Types")

    print(df.dtypes)


def train_model(training_df):
    
    validate_training_data(training_df)
    
    # ----------------------------------------
    # Time Split
    # ----------------------------------------

    unique_months = sorted(training_df["year_month"].unique())

    split_index = int(len(unique_months) * 0.8)

    cutoff_month = unique_months[split_index]

    train_df = training_df[
        training_df["year_month"] < cutoff_month
    ].copy()

    test_df = training_df[
        training_df["year_month"] >= cutoff_month
    ].copy()

    # ----------------------------------------
    # Fit encoder ONLY on training data
    # ----------------------------------------

    train_df = fit_encoders(train_df)

    test_df = transform_dataframe(test_df)

    # ----------------------------------------
    # Features
    # ----------------------------------------

    X_train = train_df[FEATURE_COLUMNS]
    y_train = train_df[TARGET_COLUMN]

    X_test = test_df[FEATURE_COLUMNS]
    y_test = test_df[TARGET_COLUMN]

    # ----------------------------------------
    # XGBoost
    # ----------------------------------------

    model = XGBRegressor(
        objective="reg:squarederror",

        n_estimators=800,

        learning_rate=0.02,

        max_depth=4,

        min_child_weight=5,

        subsample=0.8,

        colsample_bytree=0.8,

        reg_alpha=0.2,

        reg_lambda=2,

        random_state=42,

        n_jobs=-1,
    )

    print("\n========== Training ==========")

    model.fit(
        X_train,
        y_train,
    )

    # Training metrics
    train_predictions = model.predict(X_train)

    train_rmse = (
        mean_squared_error(y_train, train_predictions) ** 0.5
    )

    print(f"Training RMSE : {train_rmse:.2f}")
    print("Training Completed")

    # ----------------------------------------
    # Prediction
    # ----------------------------------------

    predictions = model.predict(X_test)

    # matplotlib

    results_df = test_df.copy()

    results_df["actual"] = y_test.values

    results_df["predicted"] = predictions

    results_df = results_df.sort_values("year_month")

    plot_actual_vs_predicted(results_df)

    # ----------------------------------------
    # Evaluation
    # ----------------------------------------

    mae = mean_absolute_error(
        y_test,
        predictions,
    )

    mse = mean_squared_error(
        y_test,
        predictions,
    )

    medae = median_absolute_error(
    y_test,
    predictions
    )

    rmse = mse ** 0.5

    mape = mean_absolute_percentage_error(
        y_test,
        predictions,
    )

    r2 = r2_score(
        y_test,
        predictions,
    )

    print("\n========== Evaluation ==========")

    print(f"MAE  : {mae:.2f}")

    print(f"MedAE: {medae:.2f}")
    
    print(f"RMSE : {rmse:.2f}")

    print(f"MAPE : {mape * 100:.2f}%")

    print(f"R²   : {r2:.4f}")

    # ----------------------------------------
    # Feature Importance
    # ----------------------------------------

    importance_df = pd.DataFrame(
        {
            "Feature": FEATURE_COLUMNS,
            "Importance": model.feature_importances_,
        }
    ).sort_values(
        by="Importance",
        ascending=False,
    )

    print("\n========== Feature Importance ==========")

    print(
    importance_df.to_string(index=False)
    )

    plot_feature_importance(importance_df)

    # ----------------------------------------
    # Save Model
    # ----------------------------------------
    metadata = {
    "model": model,
    "features": FEATURE_COLUMNS,
    "metrics": {
        "mae": mae,
        "medae": medae,
        "rmse": rmse,
        "mape": mape,
        "r2": r2,
    },
    "trained_at": datetime.now().isoformat(),
    "model_name": "XGBoost Demand Forecast",
    "model_version": "1.0.0",
    "hyperparameters": model.get_params(),
    }

    # Explainability
    explain_model(
        model,
        X_train,
    )

    # Save Model
    joblib.dump(
        metadata,
        MODEL_PATH,
    )

    print(f"\nModel saved at : {MODEL_PATH}")
    
    
    return model
