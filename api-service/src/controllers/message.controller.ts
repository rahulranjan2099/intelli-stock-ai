import { Response } from "express";

import { AuthRequest } from "../middleware/auth.middleware.js";

import {
  sendMessage,
} from "../services/message.service.js";
import { Conversation, Message } from "../models/index.js";

export const createMessage = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const conversationId = Number(
      req.params.conversationId
    );

    const { content } = req.body;

    if (!conversationId) {
      return res.status(400).json({
        message: "Invalid conversation ID",
      });
    }

    if (
      !content ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        message: "Message content is required",
      });
    }

    const result = await sendMessage({
      conversationId,
      userId: req.user!.userId,
      content: content.trim(),
    });

    return res.status(201).json(result);

  } catch (error) {

    if (
      error instanceof Error &&
      error.message === "CONVERSATION_NOT_FOUND"
    ) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Unable to process message",
    });
  }
};
export const getConversationMessages = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const conversationId = Number(
      req.params.conversationId
    );

    const conversation = await Conversation.findOne({
      where: {
        id: conversationId,
        userId: req.user!.userId,
      },
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found",
      });
    }

    const messages = await Message.findAll({
      where: {
        conversationId,
      },

      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({
      messages,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch messages",
    });
  }
};