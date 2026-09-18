import axios from "axios";
interface IntelligenceRequest {
  conversationId: number;
  message: string;
}
interface IntelligenceResponse {
  response: string;
  type: "text" | "forecast";
  data: unknown | null;
}

const intelligenceApi = axios.create({
  baseURL: process.env.INTELLIGENCE_SERVICE_URL,
  timeout: 60_000,
});


export const askIntelligenceService = async (
  input: IntelligenceRequest
): Promise<IntelligenceResponse> => {
  const response =
    await intelligenceApi.post<IntelligenceResponse>(
      "/api/chat",
      input
    );

  return response.data;
};