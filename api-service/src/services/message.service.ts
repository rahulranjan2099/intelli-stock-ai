import { Conversation, Message } from "../models/index.js";

import { askIntelligenceService } from "./intelligence.service.js";

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

  // 1. Verify conversation ownership
  const conversation = await Conversation.findOne({
    where: {
      id: conversationId,
      userId,
    },
  });

  if (!conversation) {
    throw new Error("CONVERSATION_NOT_FOUND");
  }

  // 2. Store user's message
  const userMessage = await Message.create({
    conversationId,
    role: "USER",
    content,
  });

  // Give chats a useful name and keep recently active chats at the top.
  if (conversation.title.toLowerCase() === "new conversation") {
    conversation.title = content.replace(/\s+/g, " ").slice(0, 80);
  }
  conversation.changed("updatedAt", true);
  await conversation.save();

  // 3. LangGraph handles conversation state
  const intelligenceResponse =
    await askIntelligenceService({
      conversationId,
      message: content,
    });

  // 4. Store assistant message
  const assistantMessage = await Message.create({
    conversationId,
    role: "ASSISTANT",
    content: intelligenceResponse.response,
    type: intelligenceResponse.type,
    data: intelligenceResponse.data,
  });

  return {
    userMessage,
    assistantMessage,
    conversation,

    type: intelligenceResponse.type,
    data: intelligenceResponse.data,
  };
};
