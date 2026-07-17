const axios = require("axios");

const predictionServiceUrl =
  process.env.PREDICTION_SERVICE_URL || "http://127.0.0.1:8000/api/v1";

const predictionClient = axios.create({
  baseURL: predictionServiceUrl,
  timeout: 120000,
});

exports.forecast = async (request, response) => {
  try {
    const upstreamResponse = await predictionClient.post("/forecast", request.body);
    return response.status(upstreamResponse.status).json(upstreamResponse.data);
  } catch (error) {
    if (error.response) {
      return response.status(error.response.status).json(error.response.data);
    }

    return response.status(502).json({
      detail: "Prediction service is unavailable.",
    });
  }
};

exports.recommendOrder = async (request, response) => {
  try {
    const upstreamResponse = await predictionClient.post(
      "/recommend-order",
      request.body,
    );
    return response.status(upstreamResponse.status).json(upstreamResponse.data);
  } catch (error) {
    if (error.response) {
      return response.status(error.response.status).json(error.response.data);
    }

    return response.status(502).json({
      detail: "Prediction service is unavailable.",
    });
  }
};

exports.forecastExplanation = async (request, response) => {
  try {
    const upstreamResponse = await predictionClient.post(
      "/forecast-explanation",
      request.body,
    );
    return response.status(upstreamResponse.status).json(upstreamResponse.data);
  } catch (error) {
    if (error.response) {
      return response.status(error.response.status).json(error.response.data);
    }

    return response.status(502).json({
      detail: "Prediction service is unavailable.",
    });
  }
};
