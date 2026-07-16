from serving.forecast_service import ForecastServices
from business.recommend_order import RecommendOrderService
from explainability.forecast_insights_service import ForecastInsightsService

forecast_service = ForecastServices()
recommend_order_service = RecommendOrderService()
forecast_insights_service = ForecastInsightsService()

def get_forecast_service():
    return forecast_service


def get_recommend_order_service():
    return recommend_order_service


def get_forecast_insights_service():
    return forecast_insights_service
