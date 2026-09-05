import { PredictionClient } from "../clients/prediction.client";
import type { ForecastExplanationRequest } from "../dto/forecast-explanation-request.dto";
import type { ForecastRequest } from "../dto/forecast-request.dto";
import type { RecommendOrderRequest } from "../dto/recommend-order-request.dto";
export class PredictionService {
  private readonly predictionClient: PredictionClient;

  constructor() {
    this.predictionClient = new PredictionClient();
  }

  async forecast(request: ForecastRequest) {
    const response = await this.predictionClient.forecast({
      store_id: request.storeId,
      product_id: request.productId,
      months: request.months,
      promotion_flag: request.promotionFlag,
      holiday_flag: request.holidayFlag,
      discount_pct: request.discountPct,
    });

    return response.data;
  }
  async recommendOrder(request: RecommendOrderRequest) {
    const response = await this.predictionClient.recommendOrder({
      store_id: request.storeId,
      product_id: request.productId,
      months: request.months,
      lead_time_days: request.leadTimeDays,
      promotion_flag: request.promotionFlag,
      holiday_flag: request.holidayFlag,
      discount_pct: request.discountPct,
    });

    return response.data;
  }

  async forecastExplanation(request: ForecastExplanationRequest) {
    const response = await this.predictionClient.forecastExplanation({
      store_id: request.storeId,
      product_id: request.productId,
      months: request.months,
      promotion_flag: request.promotionFlag,
      holiday_flag: request.holidayFlag,
      discount_pct: request.discountPct,
    });

    return response.data;
  }
}
