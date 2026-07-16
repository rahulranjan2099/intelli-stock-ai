from explainability.shap_explainer import ShapExplainer

from serving.feature_builder import FeatureBuilder
from serving.forecast_service import ForecastServices
from serving.predictor import Predictor

import pandas as pd

class ForecastInsightsService:

    def __init__(self):

        self.forecast_service = ForecastServices()

        self.feature_builder = FeatureBuilder()

        self.predictor = Predictor()

        self.shap = ShapExplainer(self.predictor)


    def get_forecast_insights(
        self,
        store_id: str,
        product_id: str,
        months: int = 1,
        promotion_flag: bool = False,
        holiday_flag: bool = False,
        discount_pct: float = 0,
    ):
        forecast = self.forecast_service.forecast_next(
            store_id=store_id,
            product_id=product_id,
            months=months,
            promotion_flag=promotion_flag,
            holiday_flag=holiday_flag,
            discount_pct=discount_pct,
        )

        history = self.feature_builder.get_product_history(
            store_id,
            product_id,
        )

        prediction_date = (
            history.iloc[-1]["year_month"] +
            pd.DateOffset(months=1)
        )

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

        latest_row = latest.iloc[0]

        drivers = self.shap.explain(
            encoded[self.predictor.feature_columns]
        )

        return {
            "product": {
                "store_id": store_id,
                "product_id": product_id,
                "product_name": latest_row["product_name"],
                "category": latest_row["category"],
                "city": latest_row["city"],
            },

            "forecast": {
                "forecast_start": forecast["forecast_start"],
                "forecast_end": forecast["forecast_end"],
                "forecast": forecast["forecast"],
            },

            "drivers": drivers,

            "model": {
                "name": self.predictor.model_name,
                "version": self.predictor.version,
                "metrics": self.predictor.metrics,
            },
        }
