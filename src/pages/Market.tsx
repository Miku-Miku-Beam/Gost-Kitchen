import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Market.css';

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

  if (loading) {
    return (
      <div className="market-container">
        <div className="status-message">Chargement des ingrédients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="market-container">
        <div className="status-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="market-container">
      <h1 className="market-title">MarketPlace</h1>
      
      <div className="market-grid">
        {ingredients.map((item) => (
          <div 
            key={item._id} 
            className="ingredient-card"
            onClick={() => addToCart(item)}
          >
            <span className="ingredient-category">{item.category}</span>
            <h3 className="ingredient-name">{item.name}</h3>
            <p className="ingredient-hint">Cliquer pour cuisiner</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketPlace;