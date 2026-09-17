import axios from "axios";

const intelligenceApi = axios.create({
  baseURL: process.env.INTELLIGENCE_SERVICE_URL,
  timeout: 30000,
});

interface IntelligenceResponse {
  response: string;
}

export const askIntelligenceService = async (
  message: string
): Promise<string> => {
  const response = await intelligenceApi.post<IntelligenceResponse>(
    "/forecast",
    {
      message,
    }
  );

  return response.data.response;
};