import React, { useState } from "react";
import monlogo from "./assets/logo poèle.svg";
import { useNavigate } from "react-router-dom";
import { authAPI } from "./services/api.ts";

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

  // Style de page

  const containerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    width: "100vw",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    margin: 0,
    padding: 0,
  };

  const cardStyle: React.CSSProperties = {
    width: "598px",
    height: "691px",
    borderRadius: "74px",
    backgroundColor: "#D9D9D9",
    boxShadow: "0 50px 50px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    boxSizing: "border-box",
  };

  const logoStyle: React.CSSProperties = {
    fontSize: "2rem",
    color: "#000000",
    marginBottom: "40px",
    fontWeight: "bold",
  };

  const inputContainerStyle: React.CSSProperties = {
    width: "80%",
    marginBottom: "20px",
    alignItems: "center",
    justifyContent: "center",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "1rem",
    color: "#666",
    marginBottom: "8px",
    paddingLeft: "10px",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "18px 20px",
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
    marginTop: "30px",
    backgroundColor: "#000000",
    color: "#FFFFFF",
    fontSize: "1.2rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
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
        {/* Logo ici */}
        <h1 style={logoStyle}>
          <img src={monlogo} alt="Logo" style={logoStyle} />
        </h1>

        {/* Champ Email */}
        <div style={inputContainerStyle}>
          <label style={labelStyle}>Identifiant</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            placeholder="Entrez votre email"
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

        {/* Message d'erreur */}
        {error && <div style={errorStyle}>{error}</div>}

        {/* Bouton */}
        <button
          onClick={handleLogin}
          style={buttonStyle}
          disabled={loading}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
