from datetime import datetime

from pydantic import BaseModel, Field

class ForecastItem(BaseModel):

    year_month: datetime

    predicted_demand: float

    lag_1m: float

    lag_2m: float

    lag_3m: float

    rolling_mean_3m: float

    rolling_mean_6m: float

    promotion_flag: float

    holiday_flag: float

    avg_discount_pct: float

class ForecastResponse(BaseModel):

    model_name: str

    model_version: str

    forecast_start: datetime

    forecast_end: datetime

    forecast: list[ForecastItem]


class ProductResponse(BaseModel):
    store_id: str
    product_id: str
    product_name: str


class InventoryResponse(BaseModel):
    current_stock: float
    inventory_status: str
    stock_coverage_days: float
    stock_coverage_months: float
    inventory_after_horizon: float


class MonthlyForecastResponse(BaseModel):
    year_month: str
    predicted_demand: float


class RecommendationForecastResponse(BaseModel):
    planning_horizon_months: int
    next_month_demand: float
    total_horizon_demand: float
    monthly_forecast: list[MonthlyForecastResponse]


class RecommendationResponse(BaseModel):
    lead_time_days: int
    average_daily_demand: float
    lead_time_demand: float
    safety_stock: float
    reorder_point: float
    recommended_order: int


class RecommendOrderResponse(BaseModel):
    product: ProductResponse
    inventory: InventoryResponse
    forecast: RecommendationForecastResponse
    recommendation: RecommendationResponse


class ForecastExplanationProductResponse(ProductResponse):
    category: str
    city: str


class ForecastDriverResponse(BaseModel):
    feature: str
    label: str
    impact: float
    direction: str


class ForecastExplanationForecastResponse(BaseModel):
    forecast_start: datetime
    forecast_end: datetime
    forecast_horizon_months: int
    forecast_total_demand: float
    forecast_average_demand: float
    forecast: list[ForecastItem]


class ForecastModelResponse(BaseModel):
    name: str
    version: str
    metrics: dict


class ForecastExplanationResponse(BaseModel):
    product: ForecastExplanationProductResponse
    forecast: ForecastExplanationForecastResponse
    drivers: list[ForecastDriverResponse]
    model: ForecastModelResponse
