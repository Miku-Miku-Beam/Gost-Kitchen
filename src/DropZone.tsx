import React from 'react';

const DropZone: React.FC = () => {
  const zoneStyle: React.CSSProperties = {
    position: 'absolute',
    top: '180px',
    right: '50px',
    width: '800px',
    height: '380px',
    border: '3px dashed #A88752',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(168, 135, 82, 0.1)',
    zIndex: 5
  };

  return (
    <div style={zoneStyle} id="drop-zone">
      <span style={{ color: '#A88752', fontWeight: 'bold', textAlign: 'center' }}>
        Composer plat
      </span>
    </div>
  );
};

export default DropZone;