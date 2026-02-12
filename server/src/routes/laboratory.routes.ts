import express from "express";
import {
  getIngredients,
  experimentRecipe,
  getMyRecipes,
  getAllRecipes,
} from "../controller/laboratory.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

//router.use(authenticateToken);

// Routes protégées
router.get("/ingredients", getIngredients);// authenticateToken,
router.post("/experiment", experimentRecipe); // authenticateToken,
router.get("/my-recipes",  getMyRecipes); // authenticateToken,
router.get("/recipes/all", getAllRecipes); // authenticateToken, 

export default router;
