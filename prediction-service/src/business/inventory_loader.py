from pathlib import Path

import pandas as pd

from shared.config import INVENTORY_PATH
from shared.exceptions import ProductNotFoundError

class InventoryLoader:
    
        def __init__(self):
            self.inventory = pd.read_csv(INVENTORY_PATH)
            
        def get_inventory(
            self,
            store_id: str,
            product_id: str,
        ) -> dict:
            
            inventory = self.inventory[
                (self.inventory["store_id"] == store_id)
                &
                (self.inventory["product_id"] == product_id)
            ]
            if inventory.empty:
                raise ProductNotFoundError(
                    f"No inventory found for "
                    f"store='{store_id}' "
                    f"product='{product_id}'"
                )

            return inventory.iloc[0].to_dict()