import pandas as pd

from serving.feature_builder import FeatureBuilder
from serving.predictor import Predictor

from shared.exceptions import InvalidForecastRequestError


class ForecastServices:

    def __init__(self):

        self.feature_builder = FeatureBuilder()

        self.predictor = Predictor()

    def get_history(
        self,
        store_id,
        product_id,
    ):
        history = self.feature_builder.get_product_history(
            store_id,
            product_id,
        )

        return history.copy()

    def _forecast_one_month(
        self,
        history,
        prediction_date,
        promotion_flag,
        holiday_flag,
        discount_pct,
    ):
        latest = self.feature_builder.get_latest_row(
            history,
        )

        latest = self.feature_builder.update_calendar_features(
            latest,
            prediction_date,
        )

        latest = self.feature_builder.update_business_features(
            latest,
            promotion_flag,
            holiday_flag,
            discount_pct,
        )

        encoded = self.feature_builder.encode_features(
            latest,
        )

        prediction = self.predictor.predict(
            encoded[self.predictor.feature_columns]
        )

        history = self.feature_builder.append_prediction(
            history,
            prediction,
            prediction_date,
        )

        history = self.feature_builder.update_rolling_features(
            history,
        )

        return history

    def forecast_next(
        self,
        store_id,
        product_id,
        months,
        promotion_flag=False,
        holiday_flag=False,
        discount_pct=0,
    ):
        if months <= 0:
            raise InvalidForecastRequestError(
                "months must be greater than zero."
            )

        if not 0 <= discount_pct <= 100:
            raise InvalidForecastRequestError(
                "discount_pct must be between 0 and 100."
            )

        history = self.get_history(
            store_id,
            product_id,
        )

        if history.empty:
            raise InvalidForecastRequestError(
                f"No history found for store '{store_id}' and product '{product_id}'."
            )

        last_actual_date = history.iloc[-1]["year_month"]

        current_date = last_actual_date

        for _ in range(months):

            prediction_date = (
                current_date +
                pd.DateOffset(months=1)
            )

            history = self._forecast_one_month(
                history=history,
                prediction_date=prediction_date,
                promotion_flag=promotion_flag,
                holiday_flag=holiday_flag,
                discount_pct=discount_pct,
            )

            current_date = prediction_date

        forecast = history.tail(months).copy()

        forecast = forecast[
            [
                "year_month",
                "monthly_demand",
                "lag_1m",
                "lag_2m",
                "lag_3m",
                "rolling_mean_3m",
                "rolling_mean_6m",
                "promotion_flag",
                "holiday_flag",
                "avg_discount_pct",
            ]
        ]

        forecast = forecast.rename(
            columns={
                "monthly_demand": "predicted_demand",
            }
        )

        forecast = forecast.round(
            {
                "predicted_demand": 2,
                "lag_1m": 2,
                "lag_2m": 2,
                "lag_3m": 2,
                "rolling_mean_3m": 2,
                "rolling_mean_6m": 2,
                "avg_discount_pct": 2,
            }
        )

        forecast = forecast.reset_index(drop=True)

        return {
            "model_name": self.predictor.model_name,
            "model_version": self.predictor.version,
            "forecast_start": forecast.iloc[0]["year_month"],
            "forecast_end": forecast.iloc[-1]["year_month"],
            "forecast": forecast.to_dict(orient="records"),
        }