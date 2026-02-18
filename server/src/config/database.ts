import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// 1. On charge le .env avec un chemin absolu basé sur le dossier d'exécution
dotenv.config({ path: path.resolve(process.cwd(), "server/.env") });

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  // 2. Sécurité : On vérifie si l'URI existe avant de tenter la connexion
  if (!uri) {
    console.error("❌ ERREUR : MONGODB_URI n'est pas défini dans le fichier .env");
    console.log("Chemin vérifié :", path.resolve(process.cwd(), "server/.env"));
    process.exit(1);
  }

  try {
    // 3. Tentative de connexion
    const conn = await mongoose.connect(uri);
    
    console.log(`✅ MongoDB connecté : ${conn.connection.host}`);
    console.log(`📂 Base de données : ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ Erreur de connexion MongoDB :", error);
    process.exit(1);
  }
};

// 4. Gestion des événements de connexion
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB déconnecté");
});

mongoose.connection.on("error", (err) => {
  console.error("🔥 Erreur critique MongoDB :", err);
});