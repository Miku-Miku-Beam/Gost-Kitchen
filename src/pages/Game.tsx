import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Game.css';
import { API_BASE_URL } from '../config';
// Assets & Composants
import retour from '../assets/retour.png';
import Marcket from '../assets/Market Icon.png';
import DragBox from '../components/DragBox';
import DropZone from '../components/DropZone';

/**
 * Composant principal du jeu de cuisine.
 * Gère l'inventaire, la zone de préparation et la logique de création de recettes.
 */
const Game: React.FC = () => {
  const navigate = useNavigate();

  // --- ÉTATS (STATES) ---
  const [inventory, setInventory] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [ingredientsInZone, setIngredientsInZone] = useState<{id: string, name: string}[]>([]);

  // --- EFFETS (LIFECYCLE) ---

  // Initialisation : Récupération de l'inventaire local
  useEffect(() => {
    const saved = localStorage.getItem('inventory');
    if (saved) setInventory(JSON.parse(saved));
  }, []);

  // Chargement des données métier depuis l'API Flask
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/laboratory/recipes/all`);
        const data = await response.json();
        
        if (Array.isArray(data)) setRecipes(data);
        else if (data && Array.isArray(data.recipes)) setRecipes(data.recipes);
        else setRecipes([]);
      } catch (err) {
        console.error("Erreur lors de la récupération des recettes:", err);
        setRecipes([]);
      }
    };
    fetchRecipes();
  }, []);

  // --- LOGIQUE MÉTIER ---

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

  /**
   * Logique de cuisine :
   * Compare les ingrédients présents dans la zone avec les recettes.
   * La comparaison ignore les doublons, l'ordre et la casse.
   */
  const handleCook = () => {
    if (ingredientsInZone.length === 0) {
      alert("La zone est vide !");
      return;
    }

    // 1. Préparation des noms de la zone (nettoyage et casse)
    const namesInZoneSet = new Set(
      ingredientsInZone.map(item => item.name.trim().toLowerCase())
    );

    // 2. Recherche d'une recette correspondante
    const foundRecipe = recipes.find(recipe => {
      // Sécurité : vérification que la recette possède des ingrédients
      if (!recipe.ingredients || !Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
        return false;
      }

      // Nettoyage des ingrédients de la recette et conversion en String pour TypeScript
      const cleanRecipeIngredients = recipe.ingredients.map((ing: any) => 
        String(ing).trim().toLowerCase()
      );
      
      const requiredIngredientsSet = new Set(cleanRecipeIngredients);

      // Si le nombre de types d'ingrédients diffère, la recette ne correspond pas
      if (namesInZoneSet.size !== requiredIngredientsSet.size) return false;

      // Vérifie si chaque ingrédient requis est présent dans la zone
      return [...requiredIngredientsSet].every(ingName => namesInZoneSet.has(ingName));
    });

    if (foundRecipe) {
      setScore(prev => prev + 100);
      alert(`Bravo ! Tu as fait : ${foundRecipe.name}`);
      
      // Mise à jour de l'inventaire : retrait des objets utilisés
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

  // --- RENDU (UI) ---

  return (
    <div className="game-container">
      <div className="score-display">SCORE : {score}</div>
      
      <button className="back-button" onClick={() => navigate('/')} title="Retour à l'accueil">
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

        <button className="market-button" onClick={() => navigate('/MarketPlace')} title="Aller au marché">
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