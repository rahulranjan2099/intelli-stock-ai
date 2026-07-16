from serving.forecast_service import ForecastServices

services = ForecastServices()

forecast = services.forecast_next(
    store_id="S010",
    product_id="P0001",
    months=8,
)

print(forecast["model_name"])
print(forecast["forecast_start"])
print(forecast["forecast_end"])

print(forecast["forecast"])
print(forecast["forecast"].iloc[-1])