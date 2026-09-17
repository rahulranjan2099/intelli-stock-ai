import { Router } from "express";
import userRoutes from "./user.routes.js";
import authRoutes from "./auth.routes.js"
import conversationRoutes from "./conversation.routes.js"
const router = Router();

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/conversations", conversationRoutes);

export default router;