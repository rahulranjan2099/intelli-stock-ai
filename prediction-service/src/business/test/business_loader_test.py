from business.inventory_loader import InventoryLoader

loader = InventoryLoader()

inventory = loader.get_inventory(
    store_id="S010",
    product_id="P0001",
)

print(inventory)

print(loader.inventory.columns.tolist())
print(loader.inventory.head())
