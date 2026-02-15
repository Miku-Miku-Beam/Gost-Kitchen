import React, { useState, useEffect, useRef } from 'react';
import '../styles/DragBox.css';

interface DragBoxProps {
  id: string;
  name: string;
  initialX: number;
  onDrop: (id: string, name: string) => void;
}

const DragBox: React.FC<DragBoxProps> = ({ id, name, initialX, onDrop }) => {
  const [position, setPosition] = useState({ x: initialX, y: 180 });
  const [isDragging, setIsDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y
      });
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;
      setIsDragging(false);
      
      const zoneWidth = 800;
      const zoneHeight = 380;
      const minX = window.innerWidth - (zoneWidth + 50);
      const maxX = window.innerWidth - 50;
      const minY = 600;
      const maxY = 600 + zoneHeight;

      if (e.clientX > minX && e.clientX < maxX && e.clientY > minY && e.clientY < maxY) {
        onDrop(id, name); 
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
  }, [isDragging, id, name, onDrop]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  return (
    <div 
      className={`drag-box ${isDragging ? 'dragging' : ''}`}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px` 
      }} 
      onMouseDown={handleMouseDown}
    >
      <div className="drag-box-content">
        <div className="drag-box-name">{name}</div>
        <span className="drag-box-label">Ingrédient</span>
      </div>
    </div>
  );
};

export default DragBox;