from fastapi import APIRouter, Depends

from api.dependencies import get_recommend_order_service
from api.schemas.request import RecommendOrderRequest
from api.schemas.response import RecommendOrderResponse
from business.recommend_order import RecommendOrderService
from shared.config import DEFAULT_DAYS_PER_MONTH


router = APIRouter(
    prefix="/api/v1",
    tags=["Business"],
)


@router.post(
    "/recommend-order",
    response_model=RecommendOrderResponse,
)
def recommend_order(
    request: RecommendOrderRequest,
    service: RecommendOrderService = Depends(get_recommend_order_service),
):
    """Build an inventory-aware ordering recommendation."""
    result = service.recommend_order(
        store_id=request.store_id,
        product_id=request.product_id,
        months=request.months,
        lead_time_days=request.lead_time_days,
        promotion_flag=request.promotion_flag,
        holiday_flag=request.holiday_flag,
        discount_pct=request.discount_pct,
    )

    total_demand = result["forecast_total_demand"]
    current_stock = result["current_stock"]
    monthly_forecast = [
        {
            "year_month": item["year_month"].strftime("%Y-%m-%d"),
            "predicted_demand": round(item["predicted_demand"], 2),
        }
        for item in result["monthly_forecast"]
    ]

    return {
        "product": {
            "store_id": result["store_id"],
            "product_id": result["product_id"],
            "product_name": result["product_name"],
        },
        "inventory": {
            "current_stock": current_stock,
            "inventory_status": result["inventory_status"],
            "stock_coverage_days": result["stock_coverage_days"],
            "stock_coverage_months": round(
                result["stock_coverage_days"] / DEFAULT_DAYS_PER_MONTH,
                2,
            ),
            "inventory_after_horizon": round(current_stock - total_demand, 2),
        },
        "forecast": {
            "planning_horizon_months": result["forecast_horizon_months"],
            "next_month_demand": result["forecast_next_month"],
            "total_horizon_demand": total_demand,
            "monthly_forecast": monthly_forecast,
        },
        "recommendation": {
            "lead_time_days": result["lead_time_days"],
            "average_daily_demand": result["average_daily_demand"],
            "lead_time_demand": result["lead_time_demand"],
            "safety_stock": result["safety_stock"],
            "reorder_point": result["reorder_point"],
            "recommended_order": result["recommended_order"],
        },
    }
