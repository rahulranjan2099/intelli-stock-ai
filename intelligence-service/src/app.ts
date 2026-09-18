import "dotenv/config";

import cors from "cors";
import express from "express";

import routes from "./routes/index"

const app = express();
const port = Number(process.env.PORT) || 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use("/api", routes);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Intelligence service listening on port ${port}`);
  });
}

export default app;
