import React, { useState, useRef } from 'react';

const DragBox: React.FC = () => {
  // État pour la position (x, y)(position au chargement de la page)
  const [position, setPosition] = useState({ x: 50, y: 180 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Ref pour stocker l'écart entre le curseur et le bord de la boîte (et pas stopé hahaha)
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const floatStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: '200px',
    height: '120px',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    borderRadius: '15px',
    cursor: isDragging ? 'grabbing' : 'grab',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 15px 30px rgba(0,0,0,0.4)',
    zIndex: 1000,
    userSelect: 'none', // Empêche de sélectionner le texte en glissant (sinon c'est chiant de fou)
    transition: isDragging ? 'none' : 'transform 0.1s ease', // Fluidité est mer de sureté
  };

  return (
    <div 
      style={floatStyle}
      onMouseDown={handleMouseDown}
      // On attache les mouvements au parent ou on utilise une astuce globale pour pas nous casser les noix
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div style={{ textAlign: 'center', color: '#D9D9D9', fontWeight: 'bold' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>Glisse-moi !</span>
      </div>
    </div>
  );
};

export default DragBox;