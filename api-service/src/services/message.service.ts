import {
  Conversation,
  Message,
} from "../models/index.js";

import {
  askIntelligenceService,
} from "./intelligence.service.js";

interface SendMessageInput {
  conversationId: number;
  userId: number;
  content: string;
}

export const sendMessage = async ({
  conversationId,
  userId,
  content,
}: SendMessageInput) => {

  // 1. Find conversation AND verify ownership
  const conversation = await Conversation.findOne({
    where: {
      id: conversationId,
      userId,
    },
  });

  if (!conversation) {
    throw new Error("CONVERSATION_NOT_FOUND");
  }

  // 2. Save user's message
  const userMessage = await Message.create({
    conversationId,
    role: "USER",
    content,
  });

  // 3. Call intelligence service
//   const assistantResponse =
//     await askIntelligenceService(content);
  const assistantResponse = `You asked: ${content}`

  // 4. Save assistant response
  const assistantMessage = await Message.create({
    conversationId,
    role: "ASSISTANT",
    content: assistantResponse,
  });

  return {
    userMessage,
    assistantMessage,
  };
};