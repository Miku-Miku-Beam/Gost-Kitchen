import React from 'react';
import '../styles/DropZone.css';

const DropZone: React.FC = () => {
  return (
    <div className="drop-zone" id="drop-zone">
      <span className="drop-zone-text">
        Composer ingrédients
      </span>
    </div>
  );
};

export default DropZone;