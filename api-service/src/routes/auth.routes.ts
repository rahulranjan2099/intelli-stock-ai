import { Router } from "express"
import {
    login,
    register,
    getCurrentUser
} from "../controllers/auth.controller.js"

import { authenticationToken } from "../middleware/auth.middleware.js";

const router = Router()

router.post("/register", register)
router.post("/login", login)

router.get(
  "/me",
  authenticationToken,
  getCurrentUser
);

export default router;