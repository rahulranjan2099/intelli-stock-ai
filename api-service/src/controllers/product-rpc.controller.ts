import type { RequestHandler } from "express";
import { findProductsByName } from "../services/product.service.js";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const productRpc: RequestHandler = async (request, response) => {
  const body: unknown = request.body;
  if (!isRecord(body) || body.jsonrpc !== "2.0" || typeof body.method !== "string"
    || ("id" in body && typeof body.id !== "string" && !(typeof body.id === "number" && Number.isFinite(body.id)) && body.id !== null)) {
    response.json({ jsonrpc: "2.0", id: null, error: { code: -32600, message: "Invalid Request" } });
    return;
  }

  const notification = !("id" in body);
  const fail = (code: number, message: string) => {
    if (notification) response.status(204).end();
    else response.json({ jsonrpc: "2.0", id: body.id, error: { code, message } });
  };

  if (body.method !== "products.findByName") {
    fail(-32601, "Method not found");
    return;
  }

  if (!isRecord(body.params) || typeof body.params.name !== "string"
    || !body.params.name.trim() || body.params.name.trim().length > 255) {
    fail(-32602, "A product name between 1 and 255 characters is required");
    return;
  }

  try {
    const products = await findProductsByName(body.params.name);
    if (notification) response.status(204).end();
    else response.json({ jsonrpc: "2.0", id: body.id, result: { products } });
  } catch {
    console.error("Product RPC database lookup failed");
    fail(-32603, "Product lookup failed");
  }
};
