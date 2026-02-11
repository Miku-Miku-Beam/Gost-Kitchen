import React from 'react';
import { useNavigate } from 'react-router-dom';
import retour from './assets/retour.png' ;

const Game: React.FC = () => {
  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
  };

  const buttonStyle: React.CSSProperties = {
  };

  const logoStyle: React.CSSProperties= {
  };

  return (
    <div style={containerStyle}>
      <button style={buttonStyle} onClick={() => navigate('/')}>
        <img src = {retour} style={logoStyle}/>
      </button>
    </div>
  );
};

export default Game;