const express = require("express");
const predictionController = require("../controllers/predictionController");

const router = express.Router();

router.get("/forecast", predictionController.forecast);
router.post("/recommend-order", predictionController.recommendOrder);
router.post(
  "/forecast-explanation",
  predictionController.forecastExplanation,
);

module.exports = router;
