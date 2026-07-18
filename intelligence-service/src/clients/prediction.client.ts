import axios, { AxiosInstance } from "axios";

export class PredictionClient {
  private readonly client: AxiosInstance;

  constructor() {
    const predictionServiceUrl = process.env.PREDICTION_SERVICE_URL || "http://127.0.0.1:8000/api/v1";
    this.client = axios.create({
      baseURL: predictionServiceUrl,
      timeout: 10000,
    });
  }

  async forecast(payload: unknown) {
    const response = await this.client.post(
      "/forecast",
      payload,
    );

    return response;
  }

  async recommendOrder(payload: unknown) {
    const response = await this.client.post(
      "/recommend-order",
      payload,
    );

    return response;
  }

  async forecastExplanation(payload: unknown) {
    const response = await this.client.post(
      "/forecast-explanation",
      payload,
    );

    return response;
  }
}