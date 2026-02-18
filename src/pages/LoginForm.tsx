import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import monlogo from "../assets/logo poèle.svg";
import { authAPI } from "../services/api.ts";
import "../styles/LoginForm.css";


const LoginForm: React.FC = () => {
  // --- ÉTATS (STATES) ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Stocke les messages d'erreur à afficher à l'utilisateur
  const [loading, setLoading] = useState(false); // Gère l'état visuel pendant l'appel API
  
  const navigate = useNavigate();
  //Communique avec l'API, stocke les données utilisateur et redirige vers le jeu
  const handleLogin = async () => {
    // 1. Validation basique des champs
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setLoading(true);
    setError(""); // Reset de l'erreur précédente

    try {
      // Appel au service d'authentification
      const response = await authAPI.login({ email, password });

      // Persistance des données de session
      // Le token est utilisé pour authentifier les requêtes futures vers l'API
      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.user.id);
      localStorage.setItem("restaurantName", response.user.restaurantName);

      // Redirection vers l'interface principale du jeu
      navigate("/game");
      
    } catch (err: unknown) {
      console.error("Erreur lors de la connexion:", err);

      // Gestion spécifique des erreurs Axios/Fetch
      if (err instanceof Error && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        // Affiche le message d'erreur renvoyé par le backend (ex: "Mot de passe incorrect")
        setError(axiosError.response?.data?.message || "Erreur de connexion");
      } else {
        setError("Erreur de connexion au serveur");
      }
    } finally {
      // 5. Fin de l'état de chargement quel que soit le résultat
      setLoading(false);
    }
  };

  // --- RENDU (UI) ---

  return (
    <div className="login-container">
      <div className="login-card">
        {/* En-tête avec Logo */}
        <img src={monlogo} alt="Logo" className="login-logo" />

        {/* Section Identifiant (Email) */}
        <div className="input-group">
          <label className="input-label">Identifiant</label>
          <input
            type="text"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Entrez votre email"
            disabled={loading} // Désactive le champ pendant l'envoi
          />
        </div>

        {/* Section Mot de passe */}
        <div className="input-group">
          <label className="input-label">Mot de passe</label>
          <input
            type="password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        {/* Zone de notification d'erreur dynamique */}
        {error && <div className="error-message">{error}</div>}

        {/* Actions du formulaire */}
        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        {/* Navigation vers la création de compte */}
        <p className="register-link" onClick={() => navigate("/Register")}>
          Pas encore de compte ? Créer un restaurant
        </p>
      </div>
    </div>
  );
};

export default LoginForm;