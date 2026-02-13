import { io } from "../server";
import Recipe from "../models/Recipe";
import Order from "../models/Order";
import Transaction from "../models/Transaction";
import { UserProgress } from "../models/UserProgress";

// Map pour stocker les timers actifs par userId
const activeTimers = new Map<string, NodeJS.Timeout>();

// Durée de vie d'une commande (en millisecondes)
const ORDER_DURATION = 60000; // 60 secondes

// Fonction pour générer une commande aléatoire pour un utilisateur
export const generateRandomOrder = async (userId: string, socketId: string) => {
  try {
    // Récupérer toutes les recettes
    const recipes = await Recipe.find();

    if (recipes.length === 0) {
      console.log("Aucune recette disponible");
      return;
    }

    // Choisir une recette aléatoire
    const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];

    // Calculer la date d'expiration
    const expiresAt = new Date(Date.now() + ORDER_DURATION);

    // Créer la commande en base
    const order = await Order.create({
      userId,
      recipeId: randomRecipe._id,
      recipeName: randomRecipe.name,
      status: "pending",
      expiresAt,
    });

    console.log(`Nouvelle commande pour ${userId}: ${randomRecipe.name}`);

    // Envoyer la commande au client
    io.to(socketId).emit("new-order", {
      orderId: order._id,
      recipeName: order.recipeName,
      recipeId: order.recipeId,
      expiresAt: order.expiresAt,
      duration: ORDER_DURATION,
    });

    // Créer un timer pour expirer automatiquement la commande
    const timer = setTimeout(async () => {
      await expireOrder(order._id.toString(), userId, socketId);
    }, ORDER_DURATION);

    activeTimers.set(order._id.toString(), timer);
  } catch (error) {
    console.error("Erreur generateRandomOrder:", error);
  }
};

const expireOrder = async (
  orderId: string,
  userId: string,
  socketId: string,
) => {
  try {
    const order = await Order.findById(orderId);

    if (!order || order.status !== "pending") {
      return;
    }

    order.status = "expired";
    await order.save();

    const userProgress = await UserProgress.findOne({ userId });
    if (userProgress) {
      // Pénalité : -10 satisfaction ET -50€
      const penalty = 50;

      userProgress.satisfaction = Math.max(0, userProgress.satisfaction - 10);
      userProgress.money = Math.max(0, userProgress.money - penalty);
      await userProgress.save();

      // Créer transaction de pénalité
      await Transaction.create({
        userId,
        type: "penalty",
        amount: -penalty,
        description: `Pénalité pour commande expirée: ${order.recipeName}`,
        relatedOrderId: order._id,
      });

      console.log(
        `Commande expirée: ${order.recipeName} -10 satisfaction, -${penalty}€ - Solde: ${userProgress.money}€`,
      );

      io.to(socketId).emit("order-expired", {
        orderId: order._id,
        recipeName: order.recipeName,
        satisfaction: userProgress.satisfaction,
        money: userProgress.money,
        penalty,
      });

      // Game Over si satisfaction ou argent à 0
      if (userProgress.satisfaction <= 0 || userProgress.money <= 0) {
        const reason =
          userProgress.satisfaction <= 0
            ? "satisfaction client insuffisante"
            : "faillite financière";

        io.to(socketId).emit("game-over", {
          message: `Game Over ! Votre restaurant a fermé pour ${reason}.`,
        });
        console.log(`Game Over pour ${userId}: ${reason}`);
        return;
      }
    }

    activeTimers.delete(orderId);

    setTimeout(() => {
      generateRandomOrder(userId, socketId);
    }, 5000);
  } catch (error) {
    console.error("Erreur expireOrder:", error);
  }
};

// Fonction pour arrêter tous les timers d'un utilisateur
export const stopAllTimers = (userId: string) => {
  activeTimers.forEach((timer) => {
    clearTimeout(timer);
  });
  activeTimers.clear();
  console.log(`Tous les timers arrêtés pour ${userId}`);
};
