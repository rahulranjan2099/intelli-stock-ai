import axios from "axios";
import type { RequestHandler } from "express";

import { PredictionClient } from "../clients/prediction.client"

export const forecast: RequestHandler = async (request, response) => {
  try {
    const predictionClient = new PredictionClient();
    const upstreamResponse = await predictionClient.forecast(request.body);
    response.status(upstreamResponse.status).json(upstreamResponse.data);
  } catch (error) {
    console.log('checkingerror', error)
    if (axios.isAxiosError(error) && error.response) {
      response.status(error.response.status).json(error.response.data);
      return;
    }
    
    response.status(502).json({ detail: "Prediction service is unavailable." });
  }
};

export const recommendOrder: RequestHandler = async (request, response) => {
  try {
    const predictionClient = new PredictionClient();
    const upstreamResponse = await predictionClient.recommendOrder(request.body);
    response.status(upstreamResponse.status).json(upstreamResponse.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      response.status(error.response.status).json(error.response.data);
      return;
    }
    
    response.status(502).json({ detail: "Prediction service is unavailable." });
  }
};

export const forecastExplanation: RequestHandler = async (
  request,
  response,
) => {
  try {
    const predictionClient = new PredictionClient();
    const upstreamResponse = await predictionClient.forecastExplanation(request.body);
    response.status(upstreamResponse.status).json(upstreamResponse.data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      response.status(error.response.status).json(error.response.data);
      return;
    }

    response.status(502).json({ detail: "Prediction service is unavailable." });
  }
};
