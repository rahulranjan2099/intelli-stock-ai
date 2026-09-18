import { Router } from "express";

import { createConversation, getConversations } from "../controllers/conversation.controller.js";

import { createMessage, getConversationMessages } from "../controllers/message.controller.js";

import { authenticationToken} from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticationToken);

router.post("/", createConversation);

router.get("/", getConversations);

router.post("/:conversationId/messages", createMessage);

router.get(
  "/:conversationId/messages",
  getConversationMessages
);

export default router;