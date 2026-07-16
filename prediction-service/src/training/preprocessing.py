import pandas as pd

def convert_dates(df):
    df = df.copy()

    df["date_purchased"] = pd.to_datetime(df["date_purchased"])

    return df

def sort_data(df):
    return df.sort_values(
        by=["product_id", "date_purchased"]
    )

def create_monthly_demand(df):

    df = df.copy()

    df["year_month"] = (
        df["date_purchased"]
        .dt.to_period("M")
        .dt.to_timestamp()
    )

    monthly_demand = (
        df.groupby(
            [
                "store_id",
                "city",
                "product_id",
                "product_name",
                "category",
                "year_month",
            ]
        )
        .agg(
            monthly_demand=("quantity_sold", "sum"),

            avg_unit_price=("unit_price", "mean"),

            avg_discount_pct=("discount_pct", "mean"),

            promotion_flag=("promotion_flag", "max"),

            holiday_flag=("holiday_flag", "max"),
        )
        .reset_index()
    )

    return monthly_demand

def encode_features(df):

    df = df.copy()

    categorical_columns = [
        "store_id",
        "city",
        "product_id",
        "category",
    ]

    for column in categorical_columns:

        df[column] = (
            df[column]
            .astype("category")
        )

    return df