from fastapi import APIRouter
from fastapi import Depends

from api.dependencies import get_forecast_insights_service, get_forecast_service
from api.schemas.request import ForecastRequest
from api.schemas.response import ForecastExplanationResponse, ForecastResponse

from explainability.forecast_insights_service import ForecastInsightsService
from serving.forecast_service import ForecastServices
router = APIRouter(
    prefix="/api/v1",
    tags=["Forecast"]
)

@router.post(
    "/forecast",
    response_model=ForecastResponse,
)
def forecast(
    request: ForecastRequest,
    service: ForecastServices = Depends(
        get_forecast_service
        )
):
    result = service.forecast_next(
        
        store_id=request.store_id,

        product_id=request.product_id,

        months=request.months,

        promotion_flag=request.promotion_flag,

        holiday_flag=request.holiday_flag,

        discount_pct=request.discount_pct,
    )

    return result


@router.post(
    "/forecast-explanation",
    response_model=ForecastExplanationResponse,
)
def forecast_explanation(
    request: ForecastRequest,
    service: ForecastInsightsService = Depends(get_forecast_insights_service),
):
    """Return a forecast together with its most influential model drivers."""
    result = service.get_forecast_insights(
        store_id=request.store_id,
        product_id=request.product_id,
        months=request.months,
        promotion_flag=request.promotion_flag,
        holiday_flag=request.holiday_flag,
        discount_pct=request.discount_pct,
    )

    forecast_items = result["forecast"]["forecast"]
    total_demand = round(
        sum(float(item["predicted_demand"]) for item in forecast_items),
        2,
    )

    return {
        "product": result["product"],
        "forecast": {
            "forecast_start": result["forecast"]["forecast_start"],
            "forecast_end": result["forecast"]["forecast_end"],
            "forecast_horizon_months": request.months,
            "forecast_total_demand": total_demand,
            "forecast_average_demand": round(
                total_demand / len(forecast_items),
                2,
            ),
            "forecast": forecast_items,
        },
        "drivers": [
            {
                "feature": driver["feature"],
                "label": driver["label"],
                "impact": driver["impact"],
                "direction": driver["direction"],
            }
            for driver in result["drivers"]
        ],
        "model": result["model"],
    }
