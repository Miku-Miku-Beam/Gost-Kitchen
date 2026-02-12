import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./server/.env" });

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);

    console.log(`MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error("Erreur de connexion MongoDB:", error);
    process.exit(1); // Arrête le serveur si la connexion échoue
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB déconnecté");
});

mongoose.connection.on("error", (err) => {
  console.error("Erreur MongoDB:", err);
});
