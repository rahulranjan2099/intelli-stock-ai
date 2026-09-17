import { Response } from "express";

import { AuthRequest } from "../middleware/auth.middleware.js";
import { Conversation } from "../models/index.js";

export const createConversation = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const conversation = await Conversation.create({
      userId: req.user!.userId,
      title: "New Conversation",
    });

    return res.status(201).json({
      conversation,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to create conversation",
    });
  }
};

export const getConversations = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const conversations = await Conversation.findAll({
      where: {
        userId: req.user!.userId,
      },

      order: [["updatedAt", "DESC"]],
    });

    return res.status(200).json({
      conversations,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to fetch conversations",
    });
  }
};