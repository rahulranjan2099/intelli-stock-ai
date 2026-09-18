import { timingSafeEqual } from "node:crypto";
import express, { Router } from "express";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { productRpc } from "../controllers/product-rpc.controller.js";

const router = Router();

const authenticateService: RequestHandler = (request, response, next) => {
  const token = process.env.PRODUCT_RPC_TOKEN;
  if (!token) {
    response.status(503).json({ message: "Product RPC is not configured" });
    return;
  }
  const expected = Buffer.from(`Bearer ${token}`);
  const supplied = Buffer.from(request.get("authorization") ?? "");
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    response.status(401).json({ message: "Invalid service credentials" });
    return;
  }
  next();
};

router.post("/", authenticateService, express.json({ limit: "16kb", strict: false }), productRpc);

const handleParseError: ErrorRequestHandler = (error, _request, response, next) => {
  if (response.headersSent) {
    next(error);
    return;
  }
  if (error?.type === "entity.parse.failed") {
    response.status(400).json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } });
    return;
  }
  if (error?.type === "entity.too.large") {
    response.status(413).json({ message: "RPC request body is too large" });
    return;
  }
  next(error);
};

router.use(handleParseError);

export default router;
