import { z } from "zod";

export const ForecastRequestSchema = z.object({
  storeId: z.string().min(1),
  productId: z.string().min(1),
  months: z.number().int().min(1).max(24).default(1),
  promotionFlag: z.boolean().default(false),
  holidayFlag: z.boolean().default(false),
  discountPct: z.number().min(0).max(100).default(0),
});

export type ForecastRequest = z.infer<typeof ForecastRequestSchema>;
