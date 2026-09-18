import { Router } from "express";
import predictionRoutes from "./prediction.routes";
import chatRoutes from "./chat.routes"

const router = Router();

router.use("/",chatRoutes);
router.use("/",predictionRoutes);

export default router;