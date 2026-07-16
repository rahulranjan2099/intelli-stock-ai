from serving.feature_builder import FeatureBuilder
import pandas as pd

builder = FeatureBuilder()

# --------TEST 1 ---------------
# history = builder.get_product_history(
#     store_id="S010",
#     product_id="P0001",
# )

# print(history.tail())

# print()

# latest = builder.get_latest_history(
#     "S010",
#     "P0001"
# )

# print(latest)
# --------TEST 2 ---------------
# latest = builder.get_latest_history(
#     "S010",
#     "P0001",
# )

# latest = builder.update_calendar_features(
#     latest,
#     "2025-06",
# )

# latest = builder.update_business_features(
#     latest,
#     promotion_flag=True,
#     holiday_flag=False,
#     discount_pct=20,
# )

# print(
#     latest[
#         [
#             "year_month",
#             "year",
#             "month",
#             "quarter",
#             "month_index",
#             "promotion_flag",
#             "holiday_flag",
#             "avg_discount_pct",
#             "has_discount",
#         ]
#     ]
# )

# features = builder.build_features(
#     store_id="S010",
#     product_id="P0001",
#     prediction_month="2025-06",
#     promotion_flag=True,
#     holiday_flag=False,
#     discount_pct=20,
# )

# print(features)

# --------TEST 3 ---------------

history = builder.get_product_history(
    "S010",
    "P0001",
)

history = builder.append_prediction(
    history,
    prediction=310,
    prediction_date=pd.Timestamp("2025-06-01")
)

history = builder.update_rolling_features(
    history
)

print(
    history.tail(10)[
        [
            "year_month",
            "monthly_demand",
            # "lag_1m",
            # "lag_2m",
            # "lag_3m",
            "rolling_mean_3m",
            "rolling_mean_6m",
        ]
    ]
)


# builder = FeatureBuilder()

# print(
#     builder.monthly_data[
#         ["store_id", "product_id"]
#     ].head()
# )
