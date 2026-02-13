import express from "express";
import {
  getFinancialOverview,
  getTransactionHistory,
  getExpensesBreakdown,
  getRecipeMargins,
  getBalanceEvolution,
} from "../controller/dashboard.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(authenticateToken);

// Route protégée pour récupérer les données du dashboard
router.get("/overview", getFinancialOverview);
router.get("/transaction", getTransactionHistory);
router.get("/expenses-breakdown", getExpensesBreakdown);
router.get("/recipe-margins", getRecipeMargins);
router.get("/balance-evolution", getBalanceEvolution);

export default router;
