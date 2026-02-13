import express from "express";
import {
  getMarketplaceIngredients,
  buyIngredients,
  getStock,
} from "../controller/marketPlace.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(authenticateToken);

// Routes protégées
router.get("/ingredients", authenticateToken, getMarketplaceIngredients);
router.post("/buy", authenticateToken, buyIngredients);
router.get("/stock", authenticateToken, getStock);

export default router;
