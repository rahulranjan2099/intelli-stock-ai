# Product catalog seed

Source: `prediction-service/data/retailer_product_stock_details.csv`.
The bundled `data/products.json` snapshot maps its 420 rows to 50 unique products,
deduplicated by `product_id` and sorted by that identifier. Each product ID has one
consistent name in the source.

| CSV field | Database field | Model property |
| --- | --- | --- |
| `product_id` | `products.product_id` (unique) | `Product.productId` |
| `product_name` | `products.product_name` | `Product.productName` |

The table also has an auto-incrementing `id` and timestamps. `store_id`,
`current_stock`, and `price` are not catalog fields: their values differ across
store records, including repeated product/store pairs. No arbitrary stock or
price is selected for a product.

From `api-service`, run:

```sh
npm run migration:up
npm run seed:up
```

Seeds are tracked in PostgreSQL's `SequelizeData` table, so repeating `seed:up`
skips already applied seeds. Insertion is transactional; conflicting product IDs
cause the seed to fail rather than overwrite existing records.

To remove this seed's products explicitly:

```sh
npm run seed:undo -- --seed 20260919000100-seed-products.js
```

Undo deletes the 50 mapped product IDs (including subsequent edits to those
records), leaving products with other IDs intact. The product migration can be
rolled back separately using the existing migration commands.
