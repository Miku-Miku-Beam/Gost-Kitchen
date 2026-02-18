import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import monlogo from "../assets/logo poèle.svg";
import { authAPI } from "../services/api.ts";
import "../styles/Register.css";

// gère kes nouveau utilisateur
const RegisterForm: React.FC = () => {
  // --- ÉTATS (STATES) ---
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // État pour la double vérification du mot de passe
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Valide les mots de passe avant l'envoie au back-end
  const handleRegister = async () => {
    // 1. Vérification que tous les champs obligatoires sont remplis
    if (!email || !password || !restaurantName) {
      setError("Veuillez remplir tous les champs");
      return;
    }
    
    // 2. Validation de sécurité : les deux mots de passe doivent être identiques
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 3. Appel à l'API pour créer l'entrée en base de données
      await authAPI.register({ email, password, restaurantName });
      
      // 4. Redirection vers la page de connexion après succès
      navigate("/login"); 
      
    } catch (err: unknown) {
      console.error("Erreur lors de l'inscription:", err);
      
      // Gestion des erreurs de réponse (ex: email déjà utilisé)
      if (err instanceof Error && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
        };
        setError(axiosError.response?.data?.message || "Erreur lors de l'inscription");
      } else {
        setError("Erreur de connexion au serveur");
      }
    } finally {
      // 5. Désactivation de l'état de chargement
      setLoading(false);
    }
  };

  // --- RENDU (UI) ---

  return (
    <div className="register-container">
      <div className="register-card">
        {/* Logo de l'application */}
        <img src={monlogo} alt="Logo" className="register-logo" />

        {/* Formulaire : Nom du restaurant */}
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

        {/* Formulaire : Email */}
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

        {/* Formulaire : Mot de passe principal */}
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

        {/* Formulaire : Confirmation de sécurité */}
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

        {/* Affichage des messages d'erreur de validation ou serveur */}
        {error && <div className="register-error">{error}</div>}

        {/* Actions d'inscription */}
        <button
          className="register-button"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>

        {/* Redirection pour les utilisateurs déjà inscrits */}
        <p className="login-link" onClick={() => navigate("/LoginForm")}>
          Déjà un compte ? Se connecter
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;