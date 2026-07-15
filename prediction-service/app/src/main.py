from data_loader import load_orders, load_inventory

from preprocessing import (
    convert_dates,
    sort_data,
    create_monthly_demand,
)

from feature_engineering import (
    fill_missing_months,
    create_calendar_features,
    create_lag_features,
    create_rolling_features,
)

from training import (
    prepare_training_data,
    train_model,
)

# -------------------------------
# Load Data
# -------------------------------

orders = load_orders()
inventory = load_inventory()

# -------------------------------
# Preprocessing
# -------------------------------

orders = convert_dates(orders)

orders = sort_data(orders)

monthly_demand = create_monthly_demand(orders)

# -------------------------------
# Feature Engineering
# -------------------------------

monthly_demand = fill_missing_months(monthly_demand)

monthly_demand = create_calendar_features(monthly_demand)

monthly_demand = create_lag_features(monthly_demand)

monthly_demand = create_rolling_features(monthly_demand)

# -------------------------------
# Prepare Dataset
# -------------------------------

training_df = prepare_training_data(monthly_demand)

# -------------------------------
# Training
# -------------------------------

print(
    training_df["monthly_demand"].describe()
)

train_model(training_df)
