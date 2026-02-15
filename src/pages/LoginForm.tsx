import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import monlogo from "../assets/logo poèle.svg";
import { authAPI } from "../services/api.ts";
import "../styles/LoginForm.css";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await authAPI.login({ email, password });
      localStorage.setItem("token", response.token);
      localStorage.setItem("userId", response.user.id);
      localStorage.setItem("restaurantName", response.user.restaurantName);
      navigate("/game");
    } catch (err: unknown) {
      console.error("Erreur lors de la connexion:", err);
      if (err instanceof Error && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setError(axiosError.response?.data?.message || "Erreur de connexion");
      } else {
        setError("Erreur de connexion au serveur");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Logo */}
        <img src={monlogo} alt="Logo" className="login-logo" />

        {/* Champ Email */}
        <div className="input-group">
          <label className="input-label">Identifiant</label>
          <input
            type="text"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Entrez votre email"
            disabled={loading}
          />
        </div>

        {/* Champ Mot de passe */}
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

        {error && <div className="error-message">{error}</div>}

        {/* Bouton Connexion */}
        <button
          className="login-button"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        {/* Lien vers Register */}
        <p className="register-link" onClick={() => navigate("/Register")}>
          Pas encore de compte ? Créer un restaurant
        </p>
      </div>
    </div>
  );
};

export default LoginForm;