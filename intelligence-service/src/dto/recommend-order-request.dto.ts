import { z } from "zod";

import { ForecastRequestSchema } from "./forecast-request.dto";

export const RecommendOrderRequestSchema = ForecastRequestSchema.extend({
  leadTimeDays: z.number().int().min(0).default(7),
});

export type RecommendOrderRequest = z.infer<typeof RecommendOrderRequestSchema>;
