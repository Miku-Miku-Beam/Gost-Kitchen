import React from 'react';
import { useNavigate } from 'react-router-dom';

const Game: React.FC = () => {
  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontFamily: 'Arial, sans-serif'
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: '20px',
    padding: '10px 20px',
    cursor: 'pointer',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#61dafb',
    fontWeight: 'bold'
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