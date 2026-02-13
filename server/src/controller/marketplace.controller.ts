import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import Ingredient from "../models/Ingredient";
import { UserProgress } from "../models/UserProgress";
import Transaction from "../models/Transaction";
import mongoose from "mongoose";

// GET /api/marketplace/ingredients - Liste des ingrédients avec prix
export const getMarketplaceIngredients = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const ingredients = await Ingredient.find().select(
      "_id name category price",
    );

    res.status(200).json({
      success: true,
      count: ingredients.length,
      ingredients,
    });
  } catch (error) {
    console.error("Erreur getMarketplaceIngredients:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    res
      .status(500)
      .json({ success: false, message: "Erreur serveur", error: errorMessage });
  }
};

// POST /api/marketplace/buy - Acheter des ingrédients
export const buyIngredients = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { purchases } = req.body; // Array of { ingredientId, quantity }
    const userId = req.userId;

    // Validation
    if (!purchases || !Array.isArray(purchases) || purchases.length === 0) {
      res.status(400).json({
        success: false,
        message: "Veuillez fournir une liste d'achats",
      });
      return;
    }

    // Récupérer la progression du joueur
    const userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      res
        .status(404)
        .json({ success: false, message: "Progression non trouvée" });
      return;
    }

    // Calculer le coût total
    let totalCost = 0;
    const purchaseDetails = [];

    for (const purchase of purchases) {
      const ingredient = await Ingredient.findById(purchase.ingredientId);
      if (!ingredient) {
        res.status(404).json({
          success: false,
          message: `Ingrédient ${purchase.ingredientId} introuvable`,
        });
        return;
      }

      const cost = ingredient.price * purchase.quantity;
      totalCost += cost;

      purchaseDetails.push({
        ingredientId: ingredient._id,
        name: ingredient.name,
        quantity: purchase.quantity,
        unitPrice: ingredient.price,
        totalPrice: cost,
      });
    }

    // Vérifier si le joueur a assez d'argent
    if (userProgress.money < totalCost) {
      res.status(400).json({
        success: false,
        message: `Fonds insuffisants ! Coût: ${totalCost}€, Disponible: ${userProgress.money}€`,
      });
      return;
    }

    // Effectuer l'achat
    userProgress.money -= totalCost;

    // Mettre à jour le stock
    for (const purchase of purchases) {
      const existingStock = userProgress.stock.find(
        (s) => s.ingredientId.toString() === purchase.ingredientId,
      );

      if (existingStock) {
        existingStock.quantity += purchase.quantity;
      } else {
        userProgress.stock.push({
          ingredientId: new mongoose.Types.ObjectId(purchase.ingredientId),
          quantity: purchase.quantity,
        });
      }
    }

    await userProgress.save();

    // Créer une transaction pour chaque achat
    for (const detail of purchaseDetails) {
      await Transaction.create({
        userId,
        type: "purchase",
        amount: -detail.totalPrice,
        description: `Achat de ${detail.quantity}x ${detail.name}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Achat effectué pour ${totalCost}€`,
      totalCost,
      remainingMoney: userProgress.money,
      purchaseDetails,
      stock: userProgress.stock,
    });
  } catch (error) {
    console.error("Erreur buyIngredients:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    res
      .status(500)
      .json({ success: false, message: "Erreur serveur", error: errorMessage });
  }
};

// GET /api/marketplace/stock - Voir le stock du joueur
export const getStock = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    const userProgress = await UserProgress.findOne({ userId }).populate(
      "stock.ingredientId",
      "name category price",
    );

    if (!userProgress) {
      res
        .status(404)
        .json({ success: false, message: "Progression non trouvée" });
      return;
    }

    res.status(200).json({
      success: true,
      money: userProgress.money,
      stock: userProgress.stock,
    });
  } catch (error) {
    console.error("Erreur getStock:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    res
      .status(500)
      .json({ success: false, message: "Erreur serveur", error: errorMessage });
  }
};
