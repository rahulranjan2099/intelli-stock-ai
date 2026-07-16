from pydantic import BaseModel, Field

# to validate incoming json
class ForecastRequest(BaseModel):

    store_id: str

    product_id: str

    months: int = Field(
        ge=1,
        le=24,
        description="Forecast in months"
    )

    promotion_flag: bool = False

    holiday_flag: bool = False

    discount_pct: float = Field(
        default=0,
        ge=0,
        le=100
    )


class RecommendOrderRequest(ForecastRequest):
    lead_time_days: int = Field(
        default=7,
        ge=0,
        description="Supplier lead time in days",
    )
