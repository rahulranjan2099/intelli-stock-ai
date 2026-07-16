from pathlib import Path
import pandas as pd

from shared.config import RAW_DATASET_PATH, INVENTORY_PATH

def load_orders():
    return pd.read_csv(RAW_DATASET_PATH)

def load_inventory():
    return pd.read_csv(INVENTORY_PATH)
