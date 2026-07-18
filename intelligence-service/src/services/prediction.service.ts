import { PredictionClient } from "../clients/prediction.client";

export class PredictionService {
  private readonly predictionClient: PredictionClient;

  constructor() {
    this.predictionClient = new PredictionClient();
  }

  async forecast(payload: unknown) {
    return this.predictionClient.forecast(payload);
  }

  async recommendOrder(payload: unknown) {
    return this.predictionClient.recommendOrder(payload);
  }

  async forecastExplanation(payload: unknown) {
    return this.predictionClient.forecastExplanation(payload);
  }
}