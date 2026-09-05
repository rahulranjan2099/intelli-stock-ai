import { tool } from "@langchain/core/tools"
import { PredictionService } from "../../services/prediction.service"
import { ForecastRequestSchema } from "../../dto/forecast-request.dto"

export const forecastTool = tool(
    async (input) => {
        const predictionService = new PredictionService();
        return await predictionService.forecast(input);
    },
    {
        name: "forecast",

        description: "Forecast future product demand",

        schema: ForecastRequestSchema,
    }
)