import { ProductRpcClient } from "../clients/product-rpc.client.js";
import type { ProductDetails } from "../clients/product-rpc.client.js";

export class ProductService {
  private readonly client = new ProductRpcClient();

  async findByName(name: string): Promise<ProductDetails[]> {
    const search = name.trim();
    if (!search) return [];

    try {
      return await this.client.findByName(search);
    } catch (error) {
      // The inventory agent displays this message; do not expose transport details.
      throw new Error("Product catalog lookup is unavailable. Please try again.", {
        cause: error,
      });
    }
  }
}
