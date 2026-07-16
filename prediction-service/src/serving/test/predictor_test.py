from serving.feature_builder import FeatureBuilder
from serving.predictor import Predictor

builder = FeatureBuilder()
predictor = Predictor()

features = builder.build_features(
    store_id="S010",
    product_id="P0001",
    prediction_month="2025-06",
    promotion_flag=False,
    holiday_flag=False,
    discount_pct=10,
)

prediction = predictor.predict(features)

print(f"Predicted Monthly Demand: {prediction:.2f}")