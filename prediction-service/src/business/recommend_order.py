import pandas as pd

from business.inventory_loader import InventoryLoader
from serving.forecast_service import ForecastServices

from shared.config import (
    DEFAULT_DAYS_PER_MONTH,
    DEFAULT_SAFETY_STOCK_FACTOR,
)


class RecommendOrderService:

    def __init__(self):

        self.inventory_loader = InventoryLoader()

        self.forecast_service = ForecastServices()

    def recommend_order(
        self,
        store_id: str,
        product_id: str,
        months: int = 1,
        lead_time_days: int = 7,
        promotion_flag: bool = False,
        holiday_flag: bool = False,
        discount_pct: float = 0,
    ):

        if months <= 0:
            raise ValueError("months must be greater than 0")

        if lead_time_days < 0:
            raise ValueError("lead_time_days cannot be negative")

        inventory = self.inventory_loader.get_inventory(
            store_id=store_id,
            product_id=product_id,
        )

        current_stock = inventory["current_stock"]

        forecast = self.forecast_service.forecast_next(
            store_id=store_id,
            product_id=product_id,
            months=months,
            promotion_flag=promotion_flag,
            holiday_flag=holiday_flag,
            discount_pct=discount_pct,
        )

        forecast_df = pd.DataFrame(forecast["forecast"])

        forecast_next_month = float(
            forecast_df.iloc[0]["predicted_demand"]
        )

        forecast_total_demand = float(
            forecast_df["predicted_demand"].sum()
        )

        planning_days = months * DEFAULT_DAYS_PER_MONTH

        average_daily_demand = (
            forecast_total_demand / planning_days
        )

        lead_time_demand = (
            average_daily_demand * lead_time_days
        )

        safety_stock = (
            forecast_total_demand *
            DEFAULT_SAFETY_STOCK_FACTOR
        )

        reorder_point = (
            lead_time_demand +
            safety_stock
        )

        recommended_order = max(
            0,
            round(
                forecast_total_demand +
                safety_stock -
                current_stock
            )
        )
        
        stock_coverage_days = (
            current_stock /
            average_daily_demand
        )
        

        if current_stock <= reorder_point:
            inventory_status = "REORDER_NOW"

        elif current_stock <= forecast_total_demand:
            inventory_status = "INSUFFICIENT_FOR_PLANNING_HORIZON"

        else:
            inventory_status = "SUFFICIENT"

        return {
            "store_id": store_id,
            "product_id": product_id,
            "product_name": inventory["product_name"],

            "current_stock": current_stock,

            "forecast_horizon_months": months,

            "forecast_next_month": round(
                forecast_next_month,
                2,
            ),

            "forecast_total_demand": round(
                forecast_total_demand,
                2,
            ),

            "monthly_forecast": forecast["forecast"],

            "average_daily_demand": round(
                average_daily_demand,
                2,
            ),

            "stock_coverage_days": round(
                stock_coverage_days,
                2,
            ),

            "lead_time_days": lead_time_days,

            "lead_time_demand": round(
                lead_time_demand,
                2,
            ),

            "safety_stock": round(
                safety_stock,
                2,
            ),

            "reorder_point": round(
                reorder_point,
                2,
            ),

            "recommended_order": recommended_order,

            "inventory_status": inventory_status,
        }
