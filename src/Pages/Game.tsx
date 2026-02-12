import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import retour from '../assets/retour.png';
import Marcket from '../assets/Market Icon.png';
import DragBox from '../components/DragBox';
import DropZone from '../components/DropZone';

const Game: React.FC = () => {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<any[]>([]);

  // --- CHARGEMENT ---
  useEffect(() => {
    const saved = localStorage.getItem('inventory');
    if (saved) {
      setInventory(JSON.parse(saved));
    }
  }, []);

  // --- RESET ---
  const clearInventory = () => {
    localStorage.removeItem('inventory');
    setInventory([]);
  };

  // --- STYLES ---
  const containerStyle: React.CSSProperties = {
    position: 'relative', 
    minHeight: '100vh', 
    width: '100vw',
    backgroundColor: '#242424', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    overflow: 'hidden'
  };

  const bannerStyle: React.CSSProperties = {
    position: 'relative', 
    width: '100%', 
    height: '150px',
    backgroundColor: '#A88752', 
    display: 'flex', 
    alignItems: 'flex-end', 
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
  };

  const clearButtonStyle: React.CSSProperties = {
    position: 'absolute', 
    top: '20px', 
    right: '140px',
    padding: '10px 20px', 
    backgroundColor: '#000', 
    color: '#A88752',
    border: '2px solid #A88752', 
    borderRadius: '10px', 
    cursor: 'pointer',
    fontWeight: 'bold', 
    zIndex: 100
  };

  return (
    <div style={containerStyle}>
      {/* Retour */}
      <button style={{position: 'absolute', top:'20px', left:'20px', background:'none', border:'none', cursor:'pointer'}} onClick={() => navigate('/')}>
        <img src={retour} alt="Retour" style={{width:'50px'}}/>
      </button>

      {/* Vider le frigo */}
      {inventory.length > 0 && (
        <button style={clearButtonStyle} onClick={clearInventory}>
          Vider le frigo
        </button>
      )}

      <div style={bannerStyle}>
        <button 
            style={{position:'absolute', top:'0px', right:'20px', width:'100px', height:'100px', backgroundColor:'#A88752', border:'none', cursor:'pointer'}} 
            onClick={() => navigate('/MarketPlace')}
        >
            <img src={Marcket} alt="Market" style={{width:'100%'}} />
        </button>
        
        <div style={{width:'100%', height:'50px', backgroundColor:'#806952'}}></div>

        {/* DragBoxes dynamiques */}
        {inventory.map((item, index) => (
          <DragBox 
            key={`${item._id}-${index}`} 
            name={item.name} 
            initialX={100 + (index * 180)} 
          />
        ))}

        <DropZone/>
      </div>
    </div>
  );
};

export default Game;