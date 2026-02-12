import React, { useState, useEffect, useRef } from 'react';

interface DragBoxProps {
  name: string;
  initialX: number;
}

const DragBox: React.FC<DragBoxProps> = ({ name, initialX }) => {
  const [position, setPosition] = useState({ x: initialX, y: 180 });
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({ x: e.clientX - offset.current.x, y: e.clientY - offset.current.y });
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;
      setIsDragging(false);
      // Logique de collision conservée...
      console.log(`${name} déposé à :`, { x: e.clientX, y: e.clientY });
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, name]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    offset.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

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
    userSelect: 'none',
    border: '2px solid #A88752',
    transition: isDragging ? 'none' : 'transform 0.1s ease',
  };

  return (
    <div style={floatStyle} onMouseDown={handleMouseDown}>
      <div style={{ textAlign: 'center', color: '#D9D9D9', fontWeight: 'bold' }}>
        <div style={{ fontSize: '1.2rem' }}>{name}</div>
        <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>Ingrédient</span>
      </div>
    </div>
  );
};

export default DragBox;