from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from api.routers.forecast import router as forecast_router
from api.routers.health import router as health_router
from api.routers.business import router as business_router
from shared.exceptions import (
    InvalidFeatureError,
    InvalidForecastRequestError,
    ModelNotLoadedError,
    PredictionServiceError,
    ProductNotFoundError,
)

app = FastAPI(
    title="IntelliStockAI",
    version="1.0.0"
)


@app.exception_handler(PredictionServiceError)
async def prediction_service_error_handler(
    _request: Request,
    exception: PredictionServiceError,
):
    status_code = 500
    error = "PREDICTION_SERVICE_ERROR"

    if isinstance(exception, ProductNotFoundError):
        status_code = 404
        error = "PRODUCT_NOT_FOUND"
    elif isinstance(exception, (InvalidForecastRequestError, InvalidFeatureError)):
        status_code = 400
        error = "INVALID_PREDICTION_REQUEST"
    elif isinstance(exception, ModelNotLoadedError):
        status_code = 503
        error = "MODEL_NOT_AVAILABLE"

    return JSONResponse(
        status_code=status_code,
        content={
            "error": error,
            "detail": str(exception),
        },
    )

app.include_router(health_router)
app.include_router(forecast_router)
app.include_router(business_router)
