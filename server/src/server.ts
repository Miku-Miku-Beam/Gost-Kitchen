import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import authRoutes from "./routes/auth.routes";
import laboratoryRoutes from "./routes/laboratory.routes";

dotenv.config({ path: "./server/.env" });

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173", // URL de ton frontend Vite
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/laboratory", laboratoryRoutes);

// Route de test
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

// Démarrage du serveur
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
      console.log(`Frontend attendu sur http://localhost:5173`);
    });
  } catch (error) {
    console.error("Erreur au démarrage du serveur:", error);
    process.exit(1);
  }
};

startServer();
