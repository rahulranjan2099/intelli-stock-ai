import joblib
import pandas as pd

from shared.config import MODEL_PATH

from shared.exceptions import InvalidFeatureError, ModelNotLoadedError

class Predictor:

    def __init__(self):
    
        try:
            saved_model = joblib.load(MODEL_PATH)

        except FileNotFoundError as exc:
            raise ModelNotLoadedError(
                f"Model not found: {MODEL_PATH}"
            ) from exc

        self.model = saved_model["model"]
        self.feature_columns = saved_model["features"]
        self.metrics = saved_model["metrics"]
        self.model_name = saved_model["model_name"]
        self.version = saved_model.get(
            "model_version",
            "unknown",
        )

    def predict(
        self,
        features: pd.DataFrame,
    ) -> float:

        # Validate feature columns
        missing = (
            set(self.feature_columns)
            - set(features.columns)
        )

        if missing:
            raise InvalidFeatureError(
                f"Missing features: {sorted(missing)}"
            )

        # Ensures correct column order
        features = features[self.feature_columns]

        # Expect one prediction request
        if len(features) != 1:
            raise InvalidFeatureError(
                "Predictor expects exactly one feature row."
            )

        prediction = self.model.predict(features)

        return float(prediction[0])