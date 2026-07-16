import pandas as pd
import numpy as np

from shared.config import MONTHLY_DEMAND_PATH, FEATURE_COLUMNS

from shared.exceptions import ProductNotFoundError

from datetime import datetime

from training.encoders import transform_dataframe

class FeatureBuilder:

    def __init__(self):

        self.monthly_data = pd.read_csv(MONTHLY_DEMAND_PATH)

        self.monthly_data["year_month"] = pd.to_datetime(
            self.monthly_data["year_month"]
        )

        self.monthly_data = self.monthly_data.sort_values(
            ["store_id", "product_id", "year_month"]
        )
    
    def get_monthly_data(self):

        return self.monthly_data.copy()

    def get_product_history(
        self,
        store_id,
        product_id,
    ):

        history = self.monthly_data[
            (self.monthly_data["store_id"] == store_id)
            &
            (self.monthly_data["product_id"] == product_id)
        ]

        if history.empty:
            raise ProductNotFoundError(
                f"No history found for "
                f"store_id={store_id}, "
                f"product_id={product_id}"
            )

        return (
            history
            .sort_values("year_month")
            .reset_index(drop=True)
        )
    
    def get_latest_history(
        self,
        store_id,
        product_id,
    ):
        history = self.get_product_history(
            store_id,
            product_id,
        )

        if history.empty:
            return None
        
        return history.tail(1).copy()
    
    def update_calendar_features(
        self,
        row,
        prediction_month,
    ):
        """
        Update calendar features for the prediction month.
        """

        prediction_date = pd.to_datetime(
            prediction_month
        )

        row.loc[:, "year"] = prediction_date.year
        
        row.loc[:, "month"] = prediction_date.month

        row.loc[:, "quarter"] = prediction_date.quarter

        row.loc[:, "month_index"] += 1

        month = prediction_date.month

        row.loc[:, "month_sin"] = np.sin(
            2 * np.pi * month / 12
        )

        row.loc[:, "month_cos"] = np.cos(
            2 * np.pi * month / 12
        )

        row.loc[:, "year_month"] = prediction_date

        return row
    
    def update_business_features(
        self,
        row,
        promotion_flag,
        holiday_flag,
        discount_pct,
    ):

        row.loc[:, "promotion_flag"] = int(promotion_flag)

        row.loc[:, "holiday_flag"] = int(holiday_flag)

        row.loc[:, "avg_discount_pct"] = discount_pct

        row.loc[:, "has_discount"] = int(discount_pct > 0)

        return row

    def encode_features(
        self,
        row
    ):
        """
        Encode categorical features using the fitted LabelEncoders
        """

        row = transform_dataframe(row)

        return row
    
    def build_features(
        self,
        store_id,
        product_id,
        prediction_month,
        promotion_flag,
        holiday_flag,
        discount_pct,
    ):
        row = self.get_latest_history(
            store_id,
            product_id,
        )

        if row is None:
            raise ValueError(
                f"No history found for "
                f"{store_id=} {product_id=}"
            )

        row = self.update_calendar_features(
            row,
            prediction_month,
        )

        row = self.update_business_features(
            row,
            promotion_flag,
            holiday_flag,
            discount_pct,
        )

        row = self.encode_features(row)

        return row[FEATURE_COLUMNS]
        
    def append_prediction(
        self,
        history: pd.DataFrame,
        prediction: float,
        prediction_date: pd.Timestamp,
    ) -> pd.DataFrame:
        """
        Append a predicted month to history and update lag features
        """

        latest = history.iloc[-1].copy()

        new_row = latest.copy()

        new_row["year_month"] = prediction_date

        new_row["year"] = prediction_date.year

        new_row["month"] = prediction_date.month

        new_row["quarter"] = prediction_date.quarter

        new_row["month_index"] = latest["month_index"] + 1

        new_row["monthly_demand"] = prediction

        new_row["lag_1m"] = latest["monthly_demand"]

        new_row["lag_2m"] = latest["lag_1m"]

        new_row["lag_3m"] = latest["lag_2m"]

        history = pd.concat(
            [
                history,
                pd.DataFrame([new_row]),
            ],
            ignore_index=True,
        )

        return history
    
    def update_rolling_features(
        self,
        history,
    ):
        """
        Recompute rolling features for the newest row.
        """

        demand = history["monthly_demand"]

        history["rolling_mean_3m"] = (
            demand
            .shift(1)
            .rolling(3)
            .mean()
        )

        history["rolling_mean_6m"] = (
            demand
            .shift(1)
            .rolling(6)
            .mean()
        )

        return history
    
    def get_latest_row(
        self,
        history,
    ):
        return history.tail(1).copy()