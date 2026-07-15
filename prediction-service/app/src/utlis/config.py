from pathlib import Path

MODEL_DIR = Path("app/models")
MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODEL_PATH = MODEL_DIR / "xgboost_model.pkl"
ENCODER_PATH = MODEL_DIR / "encoders.pkl"

FEATURE_COLUMNS = [
    # Store / Product
    "store_id",
    "city",
    "product_id",
    "category",

    # Calendar
    "year",
    "month",
    "quarter",
    "month_index",

    # Seasonality
    "month_sin",
    "month_cos",

    # Business
    "promotion_flag",
    "holiday_flag",
    "avg_discount_pct",
    "has_discount",
    "avg_unit_price",

    # Demand History
    "lag_1m",
    "lag_2m",
    "lag_3m",
    "rolling_mean_3m",
    "rolling_mean_6m",
]

TARGET_COLUMN = "monthly_demand"

CATEGORICAL_COLUMNS = [
    "store_id",
    "city",
    "product_id",
    "category",
]
