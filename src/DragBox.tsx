import React, { useState, useEffect, useRef } from 'react';

const DragBox: React.FC = () => {
  // --- ÉTAT DE LA POSITION ---
  // Position (x, y)(position au chargement de la page)
  const [position, setPosition] = useState({ x: 50, y: 180 });
  
  // Indique si l'utilisateur est en train de cliquer et glisser le rond
  const [isDragging, setIsDragging] = useState(false);
  
  // --- RÉFÉRENCE POUR L'ÉCART (OFFSET) ---
  // Stocke l'écart entre le curseur et le bord de la boîte (et pas stopé hahaha)
  const offset = useRef({ x: 0, y: 0 });

  // --- GESTION DU MOUVEMENT GLOBAL ---
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      // On met à jour la position en suivant la souris
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y
      });
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;
      setIsDragging(false);

      // --- LOGIQUE DE DÉTECTION (Basée sur ta ZoneStyle) ---
      const zoneWidth = 800;
      const zoneHeight = 380;
      const marginRight = 50;
      const marginTop = 600;

      // Calcul des bordures réelles par rapport à l'écran
      const minX = window.innerWidth - (zoneWidth + marginRight);
      const maxX = window.innerWidth - marginRight;
      const minY = marginTop;
      const maxY = marginTop + zoneHeight;

      // --- VÉRIFICATION DE LA COLLISION ---
      if (e.clientX > minX && e.clientX < maxX && e.clientY > minY && e.clientY < maxY) {
        
        // REMPLACÉ : Plus d'alerte, juste un log dans la console de l'inspecteur
        console.log("🎯 Objet déposé dans la zone ! Position finale :", { x: e.clientX, y: e.clientY });
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  // --- AU CLIC SUR LE ROND ---
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  // --- STYLE DU ROND ---
  const floatStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: '160px',
    height: '160px',
    backgroundColor: 'rgba(10, 10, 10, 0.9)',
    borderRadius: '20px',
    cursor: isDragging ? 'grabbing' : 'grab',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 15px 30px rgba(0,0,0,0.4)',
    zIndex: 1000,
    userSelect: 'none', // Empêche de sélectionner le texte en glissant (sinon c'est chiant de fou)
    transition: isDragging ? 'none' : 'transform 0.1s ease', // Fluidité est mer de sureté
    border: '2px solid #A88752'
  };

  return (
    <div style={floatStyle} onMouseDown={handleMouseDown}>
      <div style={{ textAlign: 'center', color: '#D9D9D9', fontWeight: 'bold' }}>
        <span style={{ fontSize: '1rem', fontWeight: 'normal' }}>Glisse-moi !</span>
      </div>
    </div>
  );
};

export default DragBox;