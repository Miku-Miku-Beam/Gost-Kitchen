import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import Order from "../models/Order";
import { UserProgress } from "../models/UserProgress";
import { io } from "../server";
import { generateRandomOrder } from "../sockets/orderSocket";

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
      (recipe) => recipe._id.toString() === order.recipeId.toString(),
    );

    if (!knownRecipe) {
      res.status(400).json({
        success: false,
        message: `Vous ne connaissez pas cette recette${order.recipeName}`,
        hint: "Allez au laboratoire pour découvrir cette recette !",
      });
      return;
    }

    // Marquer la commande comme servie
    order.status = "served";
    order.servedAt = new Date();
    await order.save();

    //Augmenter la satisfaction de 1 points
    userProgress.satisfaction += 1;
    await userProgress.save();

    console.log(
      `Commande servie: ${order.recipeName} - Satisfaction: ${userProgress.satisfaction}`,
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
      points: 1,
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
