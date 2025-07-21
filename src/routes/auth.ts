import { Router } from "express";
import { register, login, getUser } from "../controllers/authController";
import { authenticateToken } from "../middleware/auth";

const router = Router()

// Public routes(no middleware)

router.post("/register", register)
router.post("/login", login)

// Protected routes
router.get("/me", getUser)

export default router;