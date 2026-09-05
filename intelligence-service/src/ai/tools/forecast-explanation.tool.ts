import { tool } from "@langchain/core/tools";

import { ForecastExplanationRequestSchema } from "../../dto/forecast-explanation-request.dto";
import { PredictionService } from "../../services/prediction.service";

export const forecastExplanationTool = tool(
  async (input) => {
    const predictionService = new PredictionService();
    return predictionService.forecastExplanation(input);
  },
  {
    name: "forecast_explanation",
    description: "Explain the factors that influence a product demand forecast.",
    schema: ForecastExplanationRequestSchema,
  },
);
