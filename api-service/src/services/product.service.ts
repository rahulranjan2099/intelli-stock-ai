import { Op, col, fn, where } from "sequelize";
import Product from "../models/Product.js";

export interface ProductDetails {
  productId: string;
  productName: string;
}

export async function findProductsByName(name: string): Promise<ProductDetails[]> {
  const search = name.trim().toLowerCase();
  if (!search) return [];

  const products = await Product.findAll({
    attributes: ["productId", "productName"],
    // strpos treats %, _ and backslashes literally rather than as LIKE patterns.
    where: where(fn("strpos", fn("lower", col("product_name")), search), {
      [Op.gt]: 0,
    }),
    order: [["productName", "ASC"], ["productId", "ASC"]],
    raw: true,
  });

  const exact = products.filter(product => product.productName.toLowerCase() === search);
  return exact.length ? exact : products;
}
