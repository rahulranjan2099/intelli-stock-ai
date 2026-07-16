from pathlib import Path

# ------------------------------------------------
# Base Directories
# ------------------------------------------------

BASE_DIR = Path(__file__).resolve().parents[2]

DATA_DIR = BASE_DIR / "data"

MODEL_DIR = BASE_DIR / "models"

OUTPUT_DIR = BASE_DIR / "output"

# ------------------------------------------------
# Create Directories
# ------------------------------------------------

MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

OUTPUT_DIR.mkdir(
    parents=True,
    exist_ok=True,
)

# ------------------------------------------------
# Dataset Paths
# ------------------------------------------------

RAW_DATASET_PATH = DATA_DIR / "retail_forecasting_dataset_50000.csv"

MONTHLY_DEMAND_PATH = (
    DATA_DIR
    / "feature_engineered_monthly_demand.csv"
)

INVENTORY_PATH = (
    DATA_DIR
    / "retailer_product_stock_details.csv"
)

# ------------------------------------------------
# Model Paths
# ------------------------------------------------

MODEL_PATH = MODEL_DIR / "xgboost_model.pkl"

ENCODER_PATH = MODEL_DIR / "encoders.pkl"

# ------------------------------------------------
# Output
# ------------------------------------------------

OUTPUT_PATH = OUTPUT_DIR

# ------------------------------------------------
# Training
# ------------------------------------------------

FEATURE_COLUMNS = [

    # Store
    "store_id",
    "city",

    # Product
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

    # History
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