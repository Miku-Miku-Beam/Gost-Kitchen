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

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);
  
    const zoneWidth = 800;
    const zoneHeight = 380;
    const marginRight = 50;
    const marginTop = 180;

    // Vérification de la position
    const minX = window.innerWidth - (zoneWidth + marginRight);
    const maxX = window.innerWidth - marginRight;               
    const minY = marginTop;                                     
    const maxY = marginTop + zoneHeight;

    // Vérifier si la souris est à l'intérieur au moment du lâcher
  if (e.clientX > minX && e.clientX < maxX && e.clientY > minY && e.clientY < maxY) {
    
    // Centrer le rond (160x160) au milieu de la DropZone (800x380)
    // Calcul pour centrer parfaitement : 
    // X = minX + (LargeurZone / 2) - (LargeurRond / 2)
    const centerX = minX + (zoneWidth / 2) - 80; 
    const centerY = minY + (zoneHeight / 2) - 80;

    setPosition({ x: centerX, y: centerY });
    alert("Bravo ! L'objet est dans la zone.");
  }
  };

  const floatStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: '160px',
    height: '160px',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    borderRadius: '100px',
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
        <span style={{ fontSize: '1 rem', fontWeight: 'normal' }}>Glisse-moi !</span>
      </div>
    </div>
  );
};

export default DragBox;