import dotenv from "dotenv";
import { connectDB } from "../config/database";
import Ingredient from "../models/Ingredient";
import Recipe from "../models/Recipe";

dotenv.config({ path: "./server/.env" });

const ingredients = [
  // Légumes
  { name: "Tomate", category: "légume", price: 8 },
  { name: "Oignon", category: "légume", price: 5 },
  { name: "Ail", category: "légume", price: 6 },
  { name: "Carotte", category: "légume", price: 7 },

  // Viandes & Poissons
  { name: "Poulet", category: "viande", price: 25 },
  { name: "Bœuf", category: "viande", price: 40 },
  { name: "Saumon", category: "poisson", price: 35 },

  // Produits laitiers
  { name: "Crème", category: "produit laitier", price: 12 },
  { name: "Fromage", category: "produit laitier", price: 15 },
  { name: "Beurre", category: "produit laitier", price: 10 },

  // Féculents
  { name: "Pâtes", category: "féculent", price: 8 },
  { name: "Riz", category: "féculent", price: 9 },
  { name: "Pomme de terre", category: "féculent", price: 6 },

  // Autres
  { name: "Œuf", category: "autre", price: 5 },
  { name: "Huile", category: "autre", price: 12 },
];

const seedData = async () => {
  try {
    await connectDB();
    console.log("Nettoyage de la database...");
    await Ingredient.deleteMany({});
    await Recipe.deleteMany({});

    console.log("Insertion des ingrédients...");
    const createdIngredients = await Ingredient.insertMany(ingredients);
    console.log(`Ingrédients insérés: ${createdIngredients.length}`);

    const find = (name: string) => {
      const ing = createdIngredients.find((i) => i.name === name);
      if (!ing) throw new Error(`Ingrédient ${name} non trouvé`);
      return ing._id;
    };

    console.log("Insertion des recettes...");

    const recipes = [
      {
        name: "Pâtes Carbonara",
        ingredients: [
          { ingredientId: find("Pâtes"), quantity: 1 },
          { ingredientId: find("Crème"), quantity: 1 },
          { ingredientId: find("Fromage"), quantity: 1 },
          { ingredientId: find("Œuf"), quantity: 2 },
        ],
        discoveredBy: [],
        salePrice: 85,
      },
      {
        name: "Poulet Rôti",
        ingredients: [
          { ingredientId: find("Poulet"), quantity: 1 },
          { ingredientId: find("Beurre"), quantity: 1 },
          { ingredientId: find("Ail"), quantity: 1 },
          { ingredientId: find("Pomme de terre"), quantity: 3 },
        ],
        discoveredBy: [],
        salePrice: 95,
      },
      {
        name: "Saumon Grillé",
        ingredients: [
          { ingredientId: find("Saumon"), quantity: 1 },
          { ingredientId: find("Huile"), quantity: 1 },
          { ingredientId: find("Riz"), quantity: 1 },
        ],
        discoveredBy: [],
        salePrice: 110,
      },
      {
        name: "Bœuf Bourguignon",
        ingredients: [
          { ingredientId: find("Bœuf"), quantity: 1 },
          { ingredientId: find("Carotte"), quantity: 2 },
          { ingredientId: find("Oignon"), quantity: 1 },
        ],
        discoveredBy: [],
        salePrice: 120,
      },
      {
        name: "Omelette",
        ingredients: [
          { ingredientId: find("Œuf"), quantity: 3 },
          { ingredientId: find("Beurre"), quantity: 1 },
          { ingredientId: find("Fromage"), quantity: 1 },
        ],
        discoveredBy: [],
        salePrice: 50,
      },
      {
        name: "Riz au Poulet",
        ingredients: [
          { ingredientId: find("Poulet"), quantity: 1 },
          { ingredientId: find("Riz"), quantity: 1 },
          { ingredientId: find("Oignon"), quantity: 1 },
          { ingredientId: find("Ail"), quantity: 1 },
        ],
        discoveredBy: [],
        salePrice: 80,
      },
      {
        name: "Gratin Dauphinois",
        ingredients: [
          { ingredientId: find("Pomme de terre"), quantity: 4 },
          { ingredientId: find("Crème"), quantity: 1 },
          { ingredientId: find("Fromage"), quantity: 1 },
          { ingredientId: find("Ail"), quantity: 1 },
        ],
        discoveredBy: [],
        salePrice: 70,
      },
    ];

    const createdRecipes = await Recipe.insertMany(recipes);
    console.log(`Recettes insérées: ${createdRecipes.length}`);

    console.log("Base de données initialisée !");
    process.exit(0);
  } catch (error) {
    console.error(
      "Erreur lors de l'initialisation de la base de données:",
      error,
    );
    process.exit(1);
  }
};

seedData();
