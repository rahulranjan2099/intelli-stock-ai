import { tool } from "@langchain/core/tools";

import { RecommendOrderRequestSchema } from "../../dto/recommend-order-request.dto";
import { PredictionService } from "../../services/prediction.service";

export const recommendOrderTool = tool(
  async (input) => {
    const predictionService = new PredictionService();
    return predictionService.recommendOrder(input);
  },
  {
    name: "recommend_order",
    description: "Recommend how much inventory to order for a product.",
    schema: RecommendOrderRequestSchema,
  },
);
