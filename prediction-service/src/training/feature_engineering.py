import numpy as np
import pandas as pd

def create_calendar_features(df):

    df = df.copy()

    # -------------------------
    # Calendar Features
    # -------------------------

    df["year"] = df["year_month"].dt.year
    df["month"] = df["year_month"].dt.month
    df["quarter"] = df["year_month"].dt.quarter

    # -------------------------
    # Trend Feature
    # -------------------------

    min_year = df["year"].min()

    df["month_index"] = (
        (df["year"] - min_year) * 12
        + df["month"]
    )

    # -------------------------
    # Seasonality
    # -------------------------

    df["month_sin"] = np.sin(
        2 * np.pi * df["month"] / 12
    )

    df["month_cos"] = np.cos(
        2 * np.pi * df["month"] / 12
    )
    
    df["has_discount"] = (
    df["avg_discount_pct"] > 0
    ).astype(int)
    
    return df

def create_lag_features(df):

    df = df.copy()

    grouped = df.groupby(
        ["store_id", "product_id"]
    )["monthly_demand"]

    df["lag_1m"] = grouped.shift(1)

    df["lag_2m"] = grouped.shift(2)

    df["lag_3m"] = grouped.shift(3)

    return df

def create_rolling_features(df):

    df = df.copy()

    grouped = df.groupby(
        ["store_id", "product_id"]
    )["monthly_demand"]

    df["rolling_mean_3m"] = (
        grouped.transform(
            lambda x: x.shift(1).rolling(3).mean()
        )
    )

    df["rolling_mean_6m"] = (
        grouped.transform(
            lambda x: x.shift(1).rolling(6).mean()
        )
    )

    return df


def fill_missing_months(df):

    completed_data = []

    grouped = df.groupby(
        [
            "store_id",
            "product_id",
        ]
    )

    for (store_id, product_id), group in grouped:

        group = group.sort_values("year_month")

        start_month = group["year_month"].min()
        end_month = group["year_month"].max()

        all_months = pd.date_range(
            start=start_month,
            end=end_month,
            freq="MS",
        )

        calendar = pd.DataFrame(
            {
                "year_month": all_months
            }
        )

        merged = calendar.merge(
            group,
            on="year_month",
            how="left",
        )

        merged["monthly_demand"] = (
            merged["monthly_demand"]
            .fillna(0)
        )

        merged["promotion_flag"] = (
            merged["promotion_flag"]
            .fillna(0)
        )

        merged["holiday_flag"] = (
            merged["holiday_flag"]
            .fillna(0)
        )

        merged["avg_discount_pct"] = (
            merged["avg_discount_pct"]
            .fillna(0)
        )

        merged["avg_unit_price"] = (
            merged["avg_unit_price"]
            .ffill()
        )

        merged["store_id"] = store_id
        merged["product_id"] = product_id
        merged["city"] = group["city"].iloc[0]
        merged["product_name"] = group["product_name"].iloc[0]
        merged["category"] = group["category"].iloc[0]

        completed_data.append(merged)

    return (
        pd.concat(completed_data)
        .sort_values(
            [
                "store_id",
                "product_id",
                "year_month",
            ]
        )
        .reset_index(drop=True)
    )
