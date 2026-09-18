import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import productRpcRoutes from "./routes/product-rpc.routes.js";

const app = express();

app.use(cors())
// The RPC router authenticates and parses its own body to return JSON-RPC errors.
app.use("/api/rpc", productRpcRoutes);
app.use(express.json())

app.get("/health", (req, res)=>{
    res.status(200).json({
        status: "ok",
        message: "API Service is running",
    })
})

app.use("/api", routes);

export default app;
