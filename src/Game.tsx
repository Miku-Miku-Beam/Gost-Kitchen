import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import retour from './assets/retour.png' ;
import Marcket from './assets/Market Icon.png';
import DragBox from './DragBox';
import DropZone from './DropZone';

const Game: React.FC = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<any[]>([]);

  // --- CHARGEMENT DE L'INVENTAIRE ---
  useEffect(() => {
    const saved = localStorage.getItem('inventory');
    if (saved) {
      setInventory(JSON.parse(saved));
    }
  }, []);

  // Tes styles d'origine...
  const containerStyle: React.CSSProperties = {
    position: 'relative', minHeight: '100vh', width: '100vw',
    backgroundColor: '#242424', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
  };

  const bannerStyle: React.CSSProperties = {
    position: 'relative', width: '100%', height: '150px',
    backgroundColor: '#A88752', display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
  };

  const buttonStyle2: React.CSSProperties = {
    position: 'absolute', top: '0px', right: '20px', width: '100px', height: '100px',
    backgroundColor: '#A88752', border: 'none', cursor: 'pointer', zIndex: 10
  };

  return (
    <div style={containerStyle}>
      <button style={{position: 'absolute', top: '20px', left: '20px', border:'none', background:'none'}} onClick={() => navigate('/')}>
        <img src={retour} alt="Retour" style={{width: '50px'}}/>
      </button>

      <div style={bannerStyle}>
        <button style={buttonStyle2} onClick={() => navigate('/MarketPlace')}>
            <img src={Marcket} alt="Market" style={{width: '100%'}} />
        </button>
        
        <div style={{width: '100%', height: '50px', backgroundColor: '#806952'}}></div>

        {/* AFFICHAGE DYNAMIQUE DES INGRÉDIENTS */}
        {inventory.map((item, index) => (
          <DragBox 
            key={`${item._id}-${index}`} 
            name={item.name} 
            initialX={100 + (index * 180)} // Décale les boîtes horizontalement
          />
        ))}

        <DropZone/>
      </div>
    </div>
  );
};

export default Game;