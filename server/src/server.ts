import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import { connectDB } from "./config/database";
import authRoutes from "./routes/auth.routes";
import laboratoryRoutes from "./routes/laboratory.routes";
import ordersRoutes from "./routes/order.routes";
import marketRoutes from "./routes/marketplace.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import { generateRandomOrder, stopAllTimers } from "./sockets/orderSocket";

dotenv.config({ path: "./server/.env" });

const app: Application = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173", // URL de ton frontend Vite
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("io", io); // Rendre io accessible dans les routes via req.app.get('io')

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/laboratory", laboratoryRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/marketplace", marketRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Route de test
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

io.on("connection", (socket) => {
  console.log(`Client connecté: ${socket.id}`);

  // Lorsqu'un utilisateur se connecte avec son userId
  socket.on("join-game", async (data: { userId: string }) => {
    const { userId } = data;
    console.log(`Joueur ${userId} a rejoint la partie`);

    // Associer le socket à l'utilisateur
    socket.data.userId = userId;

    // Générer la première commande
    await generateRandomOrder(userId, socket.id);
  });

  // Lorsqu'un utilisateur quitte
  socket.on("leave-game", () => {
    const userId = socket.data.userId;
    if (userId) {
      stopAllTimers(userId);
      console.log(`Joueur ${userId} a quitté la partie`);
    }
  });

  socket.on("disconnect", () => {
    const userId = socket.data.userId;
    if (userId) {
      stopAllTimers(userId);
    }
    console.log(`Client déconnecté: ${socket.id}`);
  });
});

// Démarrage du serveur
const startServer = async () => {
  try {
    await connectDB();
    httpServer.listen(PORT, () => {
      console.log(`Serveur démarré sur le port ${PORT}`);
      console.log(`Frontend attendu sur http://localhost:5173`);
      console.log(`WebSocket prêt pour les commandes`);
    });
  } catch (error) {
    console.error("Erreur au démarrage du serveur:", error);
    process.exit(1);
  }
};

startServer();

export { io };
