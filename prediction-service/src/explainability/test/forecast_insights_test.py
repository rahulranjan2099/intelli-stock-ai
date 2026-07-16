from explainability.forecast_insights_service import ForecastInsightsService

service = ForecastInsightsService()

insights = service.get_forecast_insights(
    store_id="S010",
    product_id="P0001",
    months=4,
)

print(insights)