import { z } from "zod";

export const ForecastRequestSchema = z.object({
  storeId: z.string().regex(/^S\d{3}$/, "storeId must look like S010"),
  productId: z.string().regex(/^P\d{4}$/, "productId must look like P0001"),

  months: z.number().int().positive().default(1),

  promotionFlag: z
    .boolean()
    .nullable()
    .optional()
    .transform((value) => value ?? false),

  holidayFlag: z
    .boolean()
    .nullable()
    .optional()
    .transform((value) => value ?? false),

  discountPct: z
    .number()
    .min(0)
    .max(100)
    .nullable()
    .optional()
    .transform((value) => value ?? 0),
});

export type ForecastRequest = z.infer<typeof ForecastRequestSchema>;
