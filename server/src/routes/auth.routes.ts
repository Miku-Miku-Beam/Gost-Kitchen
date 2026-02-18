import express from "express";
import { register, login, verifyToken } from "../controller/auth.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

// Routes publiques
router.post("/register", register);
router.post("/login", login);

// Route protégée
router.get("/verify", authenticateToken, verifyToken);

export default router;
