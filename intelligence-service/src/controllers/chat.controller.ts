import { Request, Response } from "express";
import { HumanMessage } from "@langchain/core/messages";

import { inventoryGraph } from "../ai/graph/inventory.graph";

export const chat = async (
  req: Request,
  res: Response
) => {
  try {
    const { conversationId, message } = req.body;

    if (!conversationId || !message) {
      return res.status(400).json({
        message: "conversationId and message are required",
      });
    }

    const result = await inventoryGraph.invoke(
      {
        messages: [
          new HumanMessage(message)
        ],
      },
      {
        configurable: {
          thread_id: `conversation-${conversationId}`,
        },
      }
    );

    const lastMessage =
      result.messages[result.messages.length - 1];

    const content =
      typeof lastMessage.content === "string"
        ? lastMessage.content
        : JSON.stringify(lastMessage.content);

    return res.status(200).json({
      response: content,

      type: result.result
        ? "forecast"
        : "text",

      data: result.result ?? null,
    });

  } catch (error) {
    console.error("Inventory chat error:", error);

    return res.status(500).json({
      message: "Unable to process request",
    });
  }
};