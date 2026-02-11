import React from 'react';
import { useNavigate } from 'react-router-dom';
import retour from './assets/retour.png' ;

const Game: React.FC = () => {
  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
    position: 'relative', 
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#242424',
  };

  const buttonStyle: React.CSSProperties = {
    position: 'absolute',    
    top: '20px',             
    left: '20px',            
    width: '50px',           
    height: '40px',          
    backgroundColor: '#242424',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px'
  };

  const logoStyle: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  };

  return (
    <div style={containerStyle}>
      <button style={buttonStyle} onClick={() => navigate('/')}>
        <img src={retour} alt="Retour" style={logoStyle}/>
      </button>
      
      
    </div>
  );
};

export default Game;