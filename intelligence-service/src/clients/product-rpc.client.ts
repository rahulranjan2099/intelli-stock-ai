import { randomUUID } from "node:crypto";
import axios from "axios";
import { z } from "zod";

const responseSchema = z.object({
  jsonrpc: z.literal("2.0"),
  id: z.string(),
  result: z.object({
    products: z.array(z.object({
      productId: z.string().min(1),
      productName: z.string().min(1),
    })),
  }),
});

export type ProductDetails = z.infer<typeof responseSchema>["result"]["products"][number];

export class ProductRpcClient {
  async findByName(name: string): Promise<ProductDetails[]> {
    const token = process.env.PRODUCT_RPC_TOKEN;
    if (!token) throw new Error("Product RPC is not configured");

    const id = randomUUID();
    // API_SERVICE_URL is the service origin, without /api.
    const baseURL = process.env.API_SERVICE_URL || "http://127.0.0.1:5000";
    const { data } = await axios.post<unknown>(`${baseURL.replace(/\/+$/, "")}/api/rpc`, {
      jsonrpc: "2.0",
      id,
      method: "products.findByName",
      params: { name },
    }, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10_000,
      maxRedirects: 0,
    });

    const response = responseSchema.parse(data);
    if (response.id !== id) throw new Error("Product RPC response ID mismatch");
    return response.result.products;
  }
}
