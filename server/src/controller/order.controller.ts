import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import Order from "../models/Order";
import Recipe from "../models/Recipe";
import { UserProgress } from "../models/UserProgress";
import { io } from "../server";
import { generateRandomOrder } from "../sockets/orderSocket";
import mongoose from "mongoose";
import Transaction from "../models/Transaction";

interface PopulatedIngredient {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  price: number;
}

const isPopulatedIngredient = (
  ingredient: mongoose.Types.ObjectId | PopulatedIngredient,
): ingredient is PopulatedIngredient => {
  return typeof ingredient === "object" && "_id" in ingredient;
};

// POST api/order/serve
export const serveOrder = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { orderId } = req.body;
    const userId = req.userId;
    if (!orderId) {
      res.status(400).json({ success: false, message: "orderId est requis" });
      return;
    }
    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ success: false, message: "Commande non trouvée" });
      return;
    }

    if (order.status !== "pending") {
      res
        .status(400)
        .json({ success: false, message: "La commande n'est pas en attente" });
      return;
    }

    if (new Date() > order.expiresAt) {
      order.status = "expired";
      await order.save();

      res.status(400).json({ success: false, message: "La commande a expiré" });
      return;
    }

    const userProgress = await UserProgress.findOne({ userId });
    if (!userProgress) {
      res.status(404).json({
        success: false,
        message: "Progression utilisateur non trouvée",
      });
      return;
    }

    // Vérifier si le joueur connaît la recette
    const knownRecipe = userProgress.discoveredRecipes.some(
      (recipeId) => recipeId._id.toString() === order.recipeId.toString(),
    );

    if (!knownRecipe) {
      res.status(400).json({
        success: false,
        message: `Vous ne connaissez pas cette recette${order.recipeName}`,
        hint: "Allez au laboratoire pour découvrir cette recette !",
      });
      return;
    }

    // Récupérer la recette complète
    const recipe = await Recipe.findById(order.recipeId).populate(
      "ingredients.ingredientId",
    );
    if (!recipe) {
      res.status(404).json({ success: false, message: "Recette introuvable" });
      return;
    }

    // Vérifier si le joueur a les ingrédients en stock
    const missingIngredients = [];

    for (const recipeIng of recipe.ingredients) {
      const ingredientDoc = isPopulatedIngredient(recipeIng.ingredientId)
        ? recipeIng.ingredientId
        : null;

      if (!ingredientDoc) continue;

      const stockItem = userProgress.stock.find(
        (s) => s.ingredientId.toString() === ingredientDoc._id.toString(),
      );

      if (!stockItem || stockItem.quantity < recipeIng.quantity) {
        missingIngredients.push({
          name: ingredientDoc.name,
          needed: recipeIng.quantity,
          inStock: stockItem?.quantity || 0,
        });
      }
    }

    if (missingIngredients.length > 0) {
      res.status(400).json({
        success: false,
        message: `Stock insuffisant !`,
        missingIngredients,
      });
      return;
    }

    // Déduire les ingrédients du stock
    for (const recipeIng of recipe.ingredients) {
      const ingredientDoc = isPopulatedIngredient(recipeIng.ingredientId)
        ? recipeIng.ingredientId
        : null;

      if (!ingredientDoc) continue;

      const stockItem = userProgress.stock.find(
        (s) => s.ingredientId.toString() === ingredientDoc._id.toString(),
      );

      if (stockItem) {
        stockItem.quantity -= recipeIng.quantity;
      }
    }

    // Marquer la commande comme servie
    order.status = "served";
    order.servedAt = new Date();
    await order.save();

    // Augmenter satisfaction et argent
    userProgress.satisfaction += 1;
    userProgress.money += recipe.salePrice;
    await userProgress.save();

    // Créer transaction de vente
    await Transaction.create({
      userId,
      type: "sale",
      amount: recipe.salePrice,
      description: `Vente de ${order.recipeName}`,
      relatedOrderId: order._id,
    });

    console.log(
      `Commande servie: ${order.recipeName} +${recipe.salePrice}€ - Nouveau solde: ${userProgress.money}€`,
    );

    // Notifier le client via WebSocket
    const sockets = await io.fetchSockets();
    const UserSocket = sockets.find((s) => s.data.userId === userId);
    if (UserSocket) {
      io.to(UserSocket.id).emit("order-served", {
        orderId: order._id,
        recipeName: order.recipeName,
        satisfaction: userProgress.satisfaction,
      });

      setTimeout(() => {
        generateRandomOrder(userId as string, UserSocket.id);
      }, 3000);
    }
    res.status(200).json({
      success: true,
      message: `Commande servie : ${order.recipeName} !`,
      satisfaction: userProgress.satisfaction,
      earned: recipe.salePrice,
      money: userProgress.money,
      stock: userProgress.stock,
    });
  } catch (error) {
    console.error("Erreur serveOrder:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    res
      .status(500)
      .json({ success: false, message: "Erreur serveur", error: errorMessage });
  }
};

// GET /api/orders/active - Récupérer les commandes actives du joueur
export const getActiveOrders = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    const orders = await Order.find({
      userId,
      status: "pending",
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Erreur getActiveOrders:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: errorMessage,
    });
  }
};

// GET /api/orders/history
export const getOrderHistory = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const stats = {
      total: orders.length,
      served: orders.filter((o) => o.status === "served").length,
      expired: orders.filter((o) => o.status === "expired").length,
    };

    res.status(200).json({
      success: true,
      stats,
      orders,
    });
  } catch (error) {
    console.error("Erreur getOrderHistory:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: errorMessage,
    });
  }
};

// GET /api/orders/satisfaction
export const getSatisfaction = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    const userProgress = await UserProgress.findOne({ userId });

    if (!userProgress) {
      res.status(404).json({
        success: false,
        message: "Progression non trouvée",
      });
      return;
    }

    res.status(200).json({
      success: true,
      satisfaction: userProgress.satisfaction,
      isGameOver: userProgress.satisfaction <= 0,
    });
  } catch (error) {
    console.error("Erreur getSatisfaction:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    res.status(500).json({
      success: false,
      message: "Erreur serveur",
      error: errorMessage,
    });
  }
};
