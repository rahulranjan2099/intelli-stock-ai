interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatInput {
  conversationId: number;
  message: string;
}

export const processMessage = async ({
  conversationId,
  message,
}: ChatInput) => {

  console.log({
    conversationId,
    message,
  });

  // Later:
  //
  // LangGraph
  //    ↓
  // intent detection
  //    ↓
  // extract product/store/date
  //    ↓
  // forecasting tool
  //    ↓
  // generate response

  return {
    response: `I received your request: ${message}`,
    type: "text",
    data: null,
  };
};