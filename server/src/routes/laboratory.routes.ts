import express from "express";
import {
  getIngredients,
  experimentRecipe,
  getMyRecipes,
  getAllRecipes,
} from "../controller/laboratory.controller";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = express.Router();

router.use(authenticateToken);

// Routes protégées
router.get("/ingredients", authenticateToken, getIngredients);// 
router.post("/experiment", authenticateToken, experimentRecipe); // 
router.get("/my-recipes",  authenticateToken, getMyRecipes); // 
router.get("/recipes/all", authenticateToken, getAllRecipes); // 

export default router;
