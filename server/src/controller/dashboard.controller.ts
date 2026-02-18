import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import Transaction from "../models/Transaction";
import Order from "../models/Order";
import { UserProgress } from "../models/UserProgress";
import Recipe from "../models/Recipe";
import mongoose from "mongoose";

// Interface pour les ingrédients peuplés
interface PopulatedIngredient {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: number;
}

// Type guard
const isPopulatedIngredient = (
  ingredient: mongoose.Types.ObjectId | PopulatedIngredient,
): ingredient is PopulatedIngredient => {
  return (
    typeof ingredient === "object" &&
    "name" in ingredient &&
    "price" in ingredient
  );
};

// GET /api/dashboard/overview - Vue d'ensemble financière
export const getFinancialOverview = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    const userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      res
        .status(404)
        .json({ success: false, message: "Progression non trouvée" });
      return;
    }

    // Récupérer toutes les transactions
    const transactions = await Transaction.find({ userId });

    // Calculer les totaux
    const totalRevenue = transactions
      .filter((t) => t.type === "sale")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = Math.abs(
      transactions
        .filter((t) => t.type === "purchase" || t.type === "penalty")
        .reduce((sum, t) => sum + t.amount, 0),
    );

    const totalPenalties = Math.abs(
      transactions
        .filter((t) => t.type === "penalty")
        .reduce((sum, t) => sum + t.amount, 0),
    );

    const netProfit = totalRevenue - totalExpenses;

    // Récupérer les stats de commandes
    const orders = await Order.find({ userId });
    const ordersServed = orders.filter((o) => o.status === "served").length;
    const ordersExpired = orders.filter((o) => o.status === "expired").length;

    res.status(200).json({
      success: true,
      overview: {
        currentMoney: userProgress.money,
        satisfaction: userProgress.satisfaction,
        totalRevenue,
        totalExpenses,
        totalPenalties,
        netProfit,
        ordersServed,
        ordersExpired,
        totalOrders: orders.length,
      },
    });
  } catch (error) {
    console.error("Erreur getFinancialOverview:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    res
      .status(500)
      .json({ success: false, message: "Erreur serveur", error: errorMessage });
  }
};

// GET /api/dashboard/transactions - Liste des transactions pour graphique
export const getTransactionHistory = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    const { limit = 50 } = req.query;

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    // Calculer le solde cumulé pour le graphique d'évolution
    const transactionsWithBalance = [];
    let runningBalance = 0;

    // Inverser pour calculer dans l'ordre chronologique
    const reversedTransactions = [...transactions].reverse();

    for (const transaction of reversedTransactions) {
      runningBalance += transaction.amount;
      transactionsWithBalance.push({
        _id: transaction._id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        createdAt: transaction.createdAt,
        balance: runningBalance,
      });
    }

    // Remettre dans l'ordre décroissant
    transactionsWithBalance.reverse();

    res.status(200).json({
      success: true,
      count: transactionsWithBalance.length,
      transactions: transactionsWithBalance,
    });
  } catch (error) {
    console.error("Erreur getTransactionHistory:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    res
      .status(500)
      .json({ success: false, message: "Erreur serveur", error: errorMessage });
  }
};

// GET /api/dashboard/expenses-breakdown - Répartition des dépenses
export const getExpensesBreakdown = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    const transactions = await Transaction.find({
      userId,
      type: { $in: ["purchase", "penalty"] },
    });

    const purchaseTotal = Math.abs(
      transactions
        .filter((t) => t.type === "purchase")
        .reduce((sum, t) => sum + t.amount, 0),
    );

    const penaltyTotal = Math.abs(
      transactions
        .filter((t) => t.type === "penalty")
        .reduce((sum, t) => sum + t.amount, 0),
    );

    const total = purchaseTotal + penaltyTotal;

    res.status(200).json({
      success: true,
      breakdown: {
        purchases: {
          amount: purchaseTotal,
          percentage: total > 0 ? Math.round((purchaseTotal / total) * 100) : 0,
        },
        penalties: {
          amount: penaltyTotal,
          percentage: total > 0 ? Math.round((penaltyTotal / total) * 100) : 0,
        },
        total,
      },
    });
  } catch (error) {
    console.error("Erreur getExpensesBreakdown:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    res
      .status(500)
      .json({ success: false, message: "Erreur serveur", error: errorMessage });
  }
};

// GET /api/dashboard/recipe-margins - Marges par recette
export const getRecipeMargins = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    // Récupérer toutes les recettes
    const recipes = await Recipe.find().populate("ingredients.ingredientId");

    const margins = [];

    for (const recipe of recipes) {
      // Calculer le coût de production
      let productionCost = 0;

      for (const ingredient of recipe.ingredients) {
        // Utilisation du type guard
        if (isPopulatedIngredient(ingredient.ingredientId)) {
          productionCost += ingredient.ingredientId.price * ingredient.quantity;
        }
      }

      const margin = recipe.salePrice - productionCost;
      const marginPercentage = Math.round((margin / recipe.salePrice) * 100);

      // Compter combien de fois cette recette a été vendue
      const salesCount = await Order.countDocuments({
        userId,
        recipeId: recipe._id,
        status: "served",
      });

      margins.push({
        recipeId: recipe._id,
        recipeName: recipe.name,
        productionCost,
        salePrice: recipe.salePrice,
        margin,
        marginPercentage,
        salesCount,
        totalProfit: margin * salesCount,
      });
    }

    // Trier par marge décroissante
    margins.sort((a, b) => b.margin - a.margin);

    res.status(200).json({
      success: true,
      count: margins.length,
      margins,
    });
  } catch (error) {
    console.error("Erreur getRecipeMargins:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    res
      .status(500)
      .json({ success: false, message: "Erreur serveur", error: errorMessage });
  }
};

// GET /api/dashboard/balance-evolution - Évolution du solde dans le temps
export const getBalanceEvolution = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    // Récupérer toutes les transactions ordonnées chronologiquement
    const transactions = await Transaction.find({ userId }).sort({
      createdAt: 1,
    });

    const userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      res
        .status(404)
        .json({ success: false, message: "Progression non trouvée" });
      return;
    }

    // Point de départ (argent initial)
    const evolution: Array<{
      date: Date;
      balance: number;
      type?: string;
      amount?: number;
      description?: string;
    }> = [
      {
        date: userProgress.userId.getTimestamp(),
        balance: 1000, // Argent de départ
      },
    ];

    let runningBalance = 1000;

    for (const transaction of transactions) {
      runningBalance += transaction.amount;
      evolution.push({
        date: transaction.createdAt,
        balance: runningBalance,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
      });
    }

    res.status(200).json({
      success: true,
      evolution,
    });
  } catch (error) {
    console.error("Erreur getBalanceEvolution:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    res
      .status(500)
      .json({ success: false, message: "Erreur serveur", error: errorMessage });
  }
};
