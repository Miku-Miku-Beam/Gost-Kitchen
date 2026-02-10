import './App.css'

const Rectangle: React.FC = () => {
  
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#1a1a1a', // Fond sombre pour le contraste
    margin: 0
  };

  const rectangleStyle: React.CSSProperties = {
    width: '598px',
    height: '691px',
    backgroundColor: '#61dafb', // Couleur cyan typique de React
    borderRadius: '74px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#000',
    fontWeight: 'bold',
    fontSize: '1.2rem'
  };

  return (
    <div style={containerStyle}>
      <div style={rectangleStyle}>
        Composant TSX
      </div>
    </div>
  );
};

function App() {

  return (
    <>
      <div>
        <Rectangle/>
      </div>
    </>
  )
}

export { Rectangle};
export default App
