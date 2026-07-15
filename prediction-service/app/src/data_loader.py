from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

ORDERS_FILE = DATA_DIR / "retail_forecasting_dataset_50000.csv"
INVENTORY_FILE = DATA_DIR / "product_inventory_realistic.csv"

def load_orders():
    return pd.read_csv(ORDERS_FILE)

def load_inventory():
    return pd.read_csv(INVENTORY_FILE)
