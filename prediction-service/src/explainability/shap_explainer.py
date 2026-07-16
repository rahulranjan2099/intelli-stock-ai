import shap

EXCLUDED_FEATURES = {
    "store_id",
    "product_id",
}

class ShapExplainer:

    FEATURE_LABELS = {
        "lag_1m": "Previous Month Demand",
        "lag_2m": "Demand Two Months Ago",
        "lag_3m": "Demand Three Months Ago",
        "rolling_mean_3m": "3-Month Average Demand",
        "rolling_mean_6m": "6-Month Average Demand",
        "promotion_flag": "Promotion",
        "holiday_flag": "Holiday",
        "avg_discount_pct": "Average Discount",
        "avg_unit_price": "Average Unit Price",
        "month": "Month",
        "quarter": "Quarter",
        "month_sin": "Seasonality (Sine)",
        "month_cos": "Seasonality (Cosine)",
        "month_index": "Month Index",
        "year": "Year",
        "city": "City",
        "category": "Category",
        "store_id": "Store",
        "product_id": "Product",
        "has_discount": "Discount Applied",
    }

    def __init__(self, predictor):

        self.predictor = predictor

        self.explainer = shap.TreeExplainer(
            predictor.model
        )

    def explain(
        self,
        features,
        top_n: int = 10,
    ):
        shap_values = self.explainer.shap_values(
            features
        )

        drivers = []

        for feature_name, feature_value, impact in zip(
            features.columns,
            features.iloc[0],
            shap_values[0],
        ):
            value = (
                feature_value.item()
                if hasattr(feature_value, "item")
                else feature_value
            )

            drivers.append(
                {
                    "feature": feature_name,

                    "label": self.FEATURE_LABELS.get(
                        feature_name,
                        feature_name,
                    ),

                    "value": feature_value,

                    "impact": round(
                        abs(float(impact)),
                        4,
                    ),

                    "direction": (
                        "increase"
                        if impact >= 0
                        else "decrease"
                    ),
                }
            )

        drivers.sort(
            key=lambda x: x["impact"],
            reverse=True,
        )
        # hide very low-impact features
        drivers = [
            driver
            for driver in drivers
            if driver["impact"] >= 0.01
        ]
        drivers = [
            driver
            for driver in drivers
                if driver["feature"] not in EXCLUDED_FEATURES
        ]
        return drivers[:top_n]