export class ProductService {
  async findByName(name: string) {
    // Temporary hardcoded example.
    // Later replace this with DB query.

    const products = [
      {
        productId: "P0001",
        productName: "Milk",
      },
      {
        productId: "P0002",
        productName: "Curd",
      },
    ];

    return products.filter((product) =>
      product.productName
        .toLowerCase()
        .includes(name.toLowerCase())
    );
  }
}