class PredictionServiceError(Exception):
    """
    Base exception for the prediction service.
    """

    pass


class ProductNotFoundError(PredictionServiceError):
    """
    Raised when no history exists for a store/product.
    """

    pass


class InvalidForecastRequestError(PredictionServiceError):
    """
    Raised when the forecast request is invalid.
    """

    pass


class InvalidFeatureError(PredictionServiceError):
    """
    Raised when required features are missing.
    """

    pass


class ModelNotLoadedError(PredictionServiceError):
    """
    Raised when the trained model cannot be loaded.
    """

    pass