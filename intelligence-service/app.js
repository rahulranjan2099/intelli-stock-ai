const express = require("express");
const cors = require("cors");
const predictionRoutes = require("./routes/predictionRoutes");

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_request, response) => {
  response.status(200).json({ status: "ok" });
});

app.use(predictionRoutes);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Intelligence service listening on port ${port}`);
  });
}

module.exports = app;
