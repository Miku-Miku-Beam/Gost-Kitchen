import express from "express";
import {
  serveOrder,
  getActiveOrders,
  getOrderHistory,
  getSatisfaction,
} from "../controller/order.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

// Pour proteger les routes
router.use(authenticateToken);

router.post("/serve", serveOrder);
router.get("/active", getActiveOrders);
router.get("/history", getOrderHistory);
router.get("/satisfaction", getSatisfaction);

export default router;
