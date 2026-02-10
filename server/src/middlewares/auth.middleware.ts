import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extension de l'interface Request pour ajouter userId
export interface AuthRequest extends Request {
  userId?: string;
}

interface JWTPayload {
  userId: string;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Format: "Bearer TOKEN"

    if (!token) {
      res.status(401).json({ message: "Token manquant" });
      return;
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      (err: jwt.VerifyErrors | null, decoded: unknown) => {
        if (err) {
          res.status(403).json({ message: "Token invalide ou expiré" });
          return;
        }

        const payload = decoded as JWTPayload;
        req.userId = payload.userId;
        next();
      },
    );
  } catch (error) {
    console.error("Erreur middleware auth:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
