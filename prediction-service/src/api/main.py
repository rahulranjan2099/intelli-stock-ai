from fastapi import FastAPI

from api.routers.forecast import router as forecast_router
from api.routers.health import router as health_router
from api.routers.business import router as business_router

app = FastAPI(
    title="IntelliStockAI",
    version="1.0.0"
)

app.include_router(health_router)
app.include_router(forecast_router)
app.include_router(business_router)
