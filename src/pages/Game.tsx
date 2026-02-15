import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Game.css';
import retour from '../assets/retour.png';
import Marcket from '../assets/Market Icon.png';
import DragBox from '../components/DragBox';
import DropZone from '../components/DropZone';

const Game: React.FC = () => {
  const navigate = useNavigate();

  const [inventory, setInventory] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [ingredientsInZone, setIngredientsInZone] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('inventory');
    if (saved) setInventory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/laboratory/recipes/all');
        const data = await response.json();
        if (Array.isArray(data)) setRecipes(data);
        else if (data && Array.isArray(data.recipes)) setRecipes(data.recipes);
        else setRecipes([]);
      } catch (err) {
        console.error("Erreur recettes:", err);
        setRecipes([]);
      }
    };
    fetchRecipes();
  }, []);

  const clearInventory = () => {
    localStorage.removeItem('inventory');
    setInventory([]);
    setIngredientsInZone([]);
  };

  const handleDropInZone = (id: string, name: string) => {
    setIngredientsInZone(prev => {
      const isAlreadyThere = prev.some(item => item.id === id);
      if (!isAlreadyThere) {
        return [...prev, { id, name }];
      }
      return prev;
    });
  };

  const handleCook = () => {
    if (ingredientsInZone.length === 0) {
      alert("La zone est vide !");
      return;
    }

    const currentIngredientNames = ingredientsInZone.map(item => item.name);

    const foundRecipe = recipes.find(recipe => {
      if (!recipe.ingredients || recipe.ingredients.length !== currentIngredientNames.length) return false;
      const recipeIngs = [...recipe.ingredients].sort();
      const zoneIngs = [...currentIngredientNames].sort();
      return recipeIngs.every((val, index) => val === zoneIngs[index]);
    });

    if (foundRecipe) {
      setScore(prev => prev + 100);
      alert(`Bravo ! Tu as fait : ${foundRecipe.name}`);
      const usedIds = ingredientsInZone.map(i => i.id);
      const remainingInventory = inventory.filter(item => !usedIds.includes(item._id));
      setInventory(remainingInventory);
      localStorage.setItem('inventory', JSON.stringify(remainingInventory));
      setIngredientsInZone([]);
    } else {
      alert("Combinaison inconnue...");
      setIngredientsInZone([]);
    }
  };

  return (
    <div className="game-container">
      <div className="score-display">SCORE : {score}</div>
      
      <button className="back-button" onClick={() => navigate('/')}>
        <img src={retour} alt="Retour" className="back-icon"/>
      </button>

      {inventory.length > 0 && (
        <button className="clear-button" onClick={clearInventory}>
          Vider le frigo
        </button>
      )}

      <div className="inventory-banner">
        <button className="cook-button" onClick={handleCook}>
          CUISINER
        </button>

        <button className="market-button" onClick={() => navigate('/MarketPlace')}>
            <img src={Marcket} alt="Market" className="market-icon" />
        </button>
        
        <div className="banner-shelf"></div>

        {inventory.map((item, index) => (
          <DragBox 
            key={`${item._id}-${index}`} 
            id={item._id} 
            name={item.name} 
            initialX={100 + (index * 180)} 
            onDrop={handleDropInZone} 
          />
        ))}

        <DropZone/>
      </div>
    </div>
  );
};

export default Game;