import { Router } from "express";

import {
  forecast,
  forecastExplanation,
  recommendOrder,
} from "../controllers/predictionController.js";

const router = Router();

router.post("/forecast", forecast);
router.post("/recommend-order", recommendOrder);
router.post("/forecast-explanation", forecastExplanation);

export default router;
