import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Ingredient {
  _id: string;
  name: string;
  category: string;
}

const MarketPlace: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // --- LOGIQUE D'AJOUT ---
  const addToCart = (ingredient: Ingredient) => {
    const saved = localStorage.getItem('inventory');
    const inventory = saved ? JSON.parse(saved) : [];
    inventory.push(ingredient);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    navigate('/game');
  };

  // --- STYLES ---
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    fontFamily: "'Segoe UI', sans-serif",
    padding: '40px',
    boxSizing: 'border-box',
    backgroundColor: '#242424',
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '1200px',
  };

  const cardStyle: React.CSSProperties = {
    width: '100%',
    height: '200px',
    borderRadius: '40px',
    backgroundColor: '#242424',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    border: '2px solid #A88752',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  };

  const nameStyle: React.CSSProperties = { 
    fontSize: '1.5rem', 
    fontWeight: 'bold', 
    margin: '10px 0', 
    color: '#267d2a'
  };

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/laboratory/ingredients');
        if (!response.ok) throw new Error('Erreur réseau');
        const data = await response.json();
        setIngredients(Array.isArray(data) ? data : data.ingredients || []);
      } catch (err) {
        setError("Connexion au serveur impossible");
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, []);

  if (loading) return <div style={containerStyle}>Chargement des ingrédients...</div>;
  if (error) return <div style={containerStyle}>{error}</div>;

  return (
    <div style={containerStyle}>
      <h1 style={{ marginBottom: '50px',  color: '#A88752'}}>MarketPlace</h1>
      <div style={gridStyle}>
        {ingredients.map((item) => (
          <div 
            key={item._id} 
            style={cardStyle} 
            onClick={() => addToCart(item)}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <span style={{ color: '#267d2a', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                {item.category}
            </span>
            <h3 style={nameStyle}>{item.name}</h3>
            <p style={{ fontSize: '0.8rem', color: '#888' }}>Cliquer pour cuisiner</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketPlace;