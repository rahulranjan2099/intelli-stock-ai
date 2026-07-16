from business.recommend_order import RecommendOrderService

service = RecommendOrderService()

result = service.recommend_order(
    store_id="S010",
    product_id="P0001",
    months=4,
)

print(result)