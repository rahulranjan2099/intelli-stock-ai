import "dotenv/config";

import cors from "cors";
import express from "express";

import routes from "./routes/index";
import { checkpointer } from "./config/langgraph-checkpointer.js";

const app = express();
const port = Number(process.env.PORT) || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use("/api", routes);

async function startServer() {
  try {
    await checkpointer.setup();

    app.listen(port, () => {
      console.log(
        `Intelligence service running on port ${port}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start intelligence service:",
      error
    );

    process.exit(1);
  }
}

startServer();