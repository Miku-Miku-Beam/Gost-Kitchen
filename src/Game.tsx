import React from 'react';
import { useNavigate } from 'react-router-dom';

const Game: React.FC = () => {
  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
  };

  const buttonStyle: React.CSSProperties = {
  };

  return (
    <div style={containerStyle}>
      <h1>🎮 Bienvenue dans le Jeu</h1>
      <p>La partie commence bientôt...</p>
      
      <button style={buttonStyle} onClick={() => navigate('/')}>
        Retour à la connexion
      </button>
    </div>
  );
};

export default Game;