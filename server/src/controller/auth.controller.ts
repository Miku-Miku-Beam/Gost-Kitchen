import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { UserProgress } from "../models/UserProgress";
import { AuthRequest } from "../middlewares/auth.middleware";

interface RegisterBody {
  restaurantName: string;
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

interface JWTPayload {
  userId: string;
}

// Inscription
export const register = async (
  req: Request<unknown, unknown, RegisterBody>,
  res: Response,
): Promise<void> => {
  try {
    const { restaurantName, email, password } = req.body;

    // Validation
    if (!restaurantName || !email || !password) {
      res.status(400).json({ message: "Tous les champs sont requis" });
      return;
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "Cet email est déjà utilisé" });
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await User.create({
      restaurantName,
      email,
      password: hashedPassword,
    });

    // Créer la progression du joueur
    await UserProgress.create({
      userId: user._id,
      discoveredRecipes: [],
      satisfaction: 20,
    });

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id.toString() } as JWTPayload,
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      message: "Restaurant créé avec succès",
      token,
      user: {
        id: user._id,
        restaurantName: user.restaurantName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erreur register:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    res.status(500).json({ message: "Erreur serveur", error: errorMessage });
  }
};

// Connexion
export const login = async (
  req: Request<unknown, unknown, LoginBody>,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      res.status(400).json({ message: "Email et mot de passe requis" });
      return;
    }

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Email ou mot de passe incorrect" });
      return;
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Email ou mot de passe incorrect" });
      return;
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user._id.toString() } as JWTPayload,
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" },
    );

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        id: user._id,
        restaurantName: user.restaurantName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erreur login:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    res.status(500).json({ message: "Erreur serveur", error: errorMessage });
  }
};

// Vérifier le token (route protégée)
export const verifyToken = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      res.status(404).json({ message: "Utilisateur non trouvé" });
      return;
    }

    res.status(200).json({
      user: {
        id: user._id,
        restaurantName: user.restaurantName,
        email: user.email,
      },
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Erreur inconnue";
    res.status(500).json({ message: "Erreur serveur", error: errorMessage });
  }
};
