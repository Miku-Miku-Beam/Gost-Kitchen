import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import monlogo from "../assets/logo poèle.svg";
import { authAPI } from "../services/api.ts";
import "../styles/Register.css";

const RegisterForm: React.FC = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!email || !password || !restaurantName) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await authAPI.register({ email, password, restaurantName });
      navigate("/login"); 
    } catch (err: unknown) {
      console.error("Erreur lors de l'inscription:", err);
      if (err instanceof Error && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setError(axiosError.response?.data?.message || "Erreur lors de l'inscription");
      } else {
        setError("Erreur de connexion au serveur");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <img src={monlogo} alt="Logo" className="register-logo" />

        <div className="register-input-group">
          <label className="register-label">Nom du Restaurant</label>
          <input
            type="text"
            className="register-input"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            placeholder="La Poèle d'Or"
            disabled={loading}
          />
        </div>

        <div className="register-input-group">
          <label className="register-label">Email</label>
          <input
            type="email"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="chef@cuisine.com"
            disabled={loading}
          />
        </div>

        <div className="register-input-group">
          <label className="register-label">Mot de passe</label>
          <input
            type="password"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <div className="register-input-group">
          <label className="register-label">Confirmer le mot de passe</label>
          <input
            type="password"
            className="register-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        {error && <div className="register-error">{error}</div>}

        <button
          className="register-button"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>

        <p className="login-link" onClick={() => navigate("/LoginForm")}>
          Déjà un compte ? Se connecter
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;