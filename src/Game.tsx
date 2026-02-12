import React from 'react';
import { useNavigate } from 'react-router-dom';
import retour from './assets/retour.png' ;
import Marcket from './assets/Market Icon.png';
import DragBox from './DragBox';
import DropZone from './DropZone';

const Game: React.FC = () => {
  const navigate = useNavigate();

  const containerStyle: React.CSSProperties = {
    position: 'relative', 
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#242424',
    display: 'flex',
    alignItems: 'center', // Centre le contenu verticalement
    justifyContent: 'center',
    margin: 0,
    overflow: 'hidden'    // Évite les barres de défilement inutiles
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

  const bannerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '150px',      // Hauteur de rectangle
    backgroundColor: '#A88752',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
  };

  const depthBannerStyle: React.CSSProperties = {
    width: '100%',
    height: '50px',      // Hauteur de rectangle
    backgroundColor: '#806952',
    display: 'flex',
    alignItems: 'absolute',
    justifyContent: 'absolute',
  };

  const marcketStyle: React.CSSProperties = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain'
  };

  const buttonStyle2: React.CSSProperties = {
    position: 'absolute',    
    top: '0px',             
    right: '20px',            
    width: '100px',           
    height: '100px',          
    backgroundColor: '#A88752',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px'
  };

  return (
    <div style={containerStyle}>
      <button style={buttonStyle} onClick={() => navigate('/')}>
        <img src={retour} alt="Retour" style={logoStyle}/>
      </button>
      <div style={bannerStyle}>
        <button style={buttonStyle2} onDoubleClick={() => navigate('/MarketPlace')}>
            <img src={Marcket} alt="Market" style={marcketStyle} />
        </button>
        <div style = {depthBannerStyle}>
        </div>
        <DragBox/>
        <DropZone/>
      </div>
      
    </div>
  );
};

export default Game;