import mongoose from "mongoose";
import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import Ingredient from "../models/Ingredient";
import Recipe from "../models/Recipe";
import { UserProgress } from "../models/UserProgress";

interface PopulatedIngredient {
  _id: mongoose.Types.ObjectId;
  name: string;
  category: string;
}

const isPopulatedIngredient = (
  ingredient: mongoose.Types.ObjectId | PopulatedIngredient,
): ingredient is PopulatedIngredient => {
  return typeof ingredient === "object" && "_id" in ingredient;
};

// Get ingredients list
export const getIngredients = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const ingredients = await Ingredient.find().select("_id name category");
    res.status(200).json({
      success: true,
      count: ingredients.length,
      ingredients,
    });
  } catch (error) {
    console.error("Erreur getIngredients:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    res
      .status(500)
      .json({ succes: false, message: "Error Serveur", error: errorMessage });
  }
};

// Post
export const experimentRecipe = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { ingredientIds } = req.body;
    const userId = req.userId;

    if (
      !ingredientIds ||
      !Array.isArray(ingredientIds) ||
      ingredientIds.length === 0
    ) {
      res.status(400).json({
        success: false,
        message: "IngredientIds doit être un tableau d'IDs d'ingrédients",
      });
      return;
    }

    const recipes = await Recipe.find().populate("ingredients.ingredientId");

    let foundRecipe = null;

    for (const recipe of recipes) {
      // Extraire les IDs d'ingrédients de la recette
      const recipeIngredientIds = recipe.ingredients
        .map((ing) => {
          if (isPopulatedIngredient(ing.ingredientId)) {
            return ing.ingredientId._id.toString();
          }
          return ing.ingredientId.toString();
        })
        .sort();

      // Trier les IDs fournis par le joueur
      const playerIngredientIds = ingredientIds
        .map((id: string) => id.toString())
        .sort();

      // Comparer les deux tableaux
      if (
        JSON.stringify(recipeIngredientIds) ===
        JSON.stringify(playerIngredientIds)
      ) {
        foundRecipe = recipe;
        break;
      }
    }

    if (!foundRecipe) {
      res.status(200).json({
        success: false,
        discovered: false,
        message: "Combinaison incorrecte ! Les ingrédients ont été perdus.",
      });
      return;
    }

    // Vérifier si le joueur a déjà découvert cette recette
    const userProgress = await UserProgress.findOne({ userId });

    if (!userProgress) {
      res
        .status(404)
        .json({ success: false, message: "Progression non trouvée" });
      return;
    }

    const alreadyDiscovered = userProgress.discoveredRecipes.some(
      (recipeId) => recipeId.toString() === foundRecipe!._id.toString(),
    );

    if (alreadyDiscovered) {
      res.status(200).json({
        success: true,
        discovered: false,
        message: "Vous avez déjà découvert cette recette !",
        recipe: {
          id: foundRecipe._id,
          name: foundRecipe.name,
        },
      });
      return;
    }

    // Ajouter la recette aux découvertes du joueur
    userProgress.discoveredRecipes.push(foundRecipe._id);
    await userProgress.save();

    // Ajouter le joueur à la liste des découvreurs de la recette
    const userObjectId = new mongoose.Types.ObjectId(userId);
    if (!foundRecipe.discoveredBy.some((id) => id.toString() === userId)) {
      foundRecipe.discoveredBy.push(userObjectId);

      res.status(200).json({
        success: true,
        discovered: true,
        message: `Recette découverte : ${foundRecipe.name} !`,
        recipe: {
          id: foundRecipe._id,
          name: foundRecipe.name,
          ingredients: foundRecipe.ingredients,
        },
      });
    }
  } catch (error) {
    console.error("Erreur experimentRecipe:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    res
      .status(500)
      .json({ success: false, message: "Erreur serveur", error: errorMessage });
  }
};

// GET /api/laboratory/my-recipes
export const getMyRecipes = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;

    const userProgress = await UserProgress.findOne({ userId }).populate({
      path: "discoveredRecipes",
      populate: {
        path: "ingredients.ingredientId",
        select: "name category",
      },
    });

    if (!userProgress) {
      res
        .status(404)
        .json({ success: false, message: "Progression non trouvée" });
      return;
    }

    res.status(200).json({
      success: true,
      count: userProgress.discoveredRecipes.length,
      recipes: userProgress.discoveredRecipes,
    });
  } catch (error) {
    console.error("Erreur getMyRecipes:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    res
      .status(500)
      .json({ success: false, message: "Erreur serveur", error: errorMessage });
  }
};

// GET /api/laboratory/recipes/all - Toutes les recettes (livre complet)
export const getAllRecipes = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const recipes = await Recipe.find().populate(
      "ingredients.ingredientId",
      "name category",
    );

    res.status(200).json({
      success: true,
      count: recipes.length,
      recipes,
    });
  } catch (error) {
    console.error("Erreur getAllRecipes:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    res
      .status(500)
      .json({ success: false, message: "Erreur serveur", error: errorMessage });
  }
};
