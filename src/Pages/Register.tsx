import React, { useState } from "react";
import monlogo from "../assets/logo poèle.svg";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api.ts";

const RegisterForm: React.FC = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    // Validation simple
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
      // On redirige vers le login après inscription réussie
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

  // --- STYLES (Copiés de LoginForm) ---

  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100vw",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    margin: 0,
    padding: "20px", // Un peu de padding pour le responsive
    boxSizing: "border-box",
  };

  const cardStyle: React.CSSProperties = {
    width: "598px",
    height: "auto", // Hauteur auto pour accueillir plus de champs
    minHeight: "691px",
    borderRadius: "74px",
    backgroundColor: "#D9D9D9",
    boxShadow: "0 50px 50px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 40px",
    boxSizing: "border-box",
  };

  const logoStyle: React.CSSProperties = {
    width: "120px",
    marginBottom: "30px",
  };

  const inputContainerStyle: React.CSSProperties = {
    width: "80%",
    marginBottom: "15px",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.9rem",
    color: "#666",
    marginBottom: "6px",
    paddingLeft: "10px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "15px 20px",
    fontSize: "1rem",
    color: "#000000",
    backgroundColor: "#f0f2f5",
    border: "none",
    borderRadius: "20px",
    outline: "none",
    boxSizing: "border-box",
    transition: "all 0.3s ease",
  };

  const buttonStyle: React.CSSProperties = {
    width: "80%",
    padding: "20px",
    marginTop: "20px",
    backgroundColor: "#000000",
    color: "#FFFFFF",
    fontSize: "1.2rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
  };

  const linkStyle: React.CSSProperties = {
    marginTop: "20px",
    color: "#666",
    fontSize: "0.9rem",
    cursor: "pointer",
    textDecoration: "underline",
  };

  const errorStyle: React.CSSProperties = {
    color: "#d32f2f",
    fontSize: "0.9rem",
    marginTop: "10px",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <img src={monlogo} alt="Logo" style={logoStyle} />

        {/* Champ Nom du Restaurant */}
        <div style={inputContainerStyle}>
          <label style={labelStyle}>Nom du Restaurant</label>
          <input
            type="text"
            value={restaurantName}
            onChange={(e) => setRestaurantName(e.target.value)}
            style={inputStyle}
            placeholder="La Poèle d'Or"
            disabled={loading}
          />
        </div>

        {/* Champ Email */}
        <div style={inputContainerStyle}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            placeholder="chef@cuisine.com"
            disabled={loading}
          />
        </div>

        {/* Champ Mot de passe */}
        <div style={inputContainerStyle}>
          <label style={labelStyle}>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        {/* Confirmation Mot de passe */}
        <div style={inputContainerStyle}>
          <label style={labelStyle}>Confirmer le mot de passe</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={inputStyle}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <button
          onClick={handleRegister}
          style={buttonStyle}
          disabled={loading}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {loading ? "Création..." : "Créer mon compte"}
        </button>

        <p style={linkStyle} onClick={() => navigate("/LoginForm")}>
          Déjà un compte ? Se connecter
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;