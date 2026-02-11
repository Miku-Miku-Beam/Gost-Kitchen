import { io } from "../server";
import Recipe from "../models/Recipe";
import Order from "../models/Order";
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

// Fonction pour expirer une commande
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

    // Marquer la commande comme expirée
    order.status = "expired";
    await order.save();

    // Diminuer la satisfaction de 10 points
    const userProgress = await UserProgress.findOne({ userId });
    if (userProgress) {
      userProgress.satisfaction = Math.max(0, userProgress.satisfaction - 10);
      await userProgress.save();

      console.log(
        `Commande expirée: ${order.recipeName} - Satisfaction: ${userProgress.satisfaction}`,
      );

      // Notifier le client
      io.to(socketId).emit("order-expired", {
        orderId: order._id,
        recipeName: order.recipeName,
        satisfaction: userProgress.satisfaction,
      });

      // Vérifier le Game Over
      if (userProgress.satisfaction <= 0) {
        io.to(socketId).emit("game-over", {
          message:
            "Game Over ! Votre restaurant a fermé pour satisfaction client insuffisante.",
        });
        console.log(`Game Over pour ${userId}`);
        return;
      }
    }

    // Nettoyer le timer
    activeTimers.delete(orderId);

    // Générer une nouvelle commande après 5 secondes
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
