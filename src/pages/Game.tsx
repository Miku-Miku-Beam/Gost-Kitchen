import React, { useState, useEffect, useCallback } from 'react';
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
 * Gère l'inventaire, la zone de préparation, la logique de création de recettes
 * et le système de commandes minutées.
 */
const Game: React.FC = () => {
  const navigate = useNavigate();

  // --- ÉTATS (STATES) ---
  const [inventory, setInventory] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [ingredientsInZone, setIngredientsInZone] = useState<{id: string, name: string}[]>([]);
  
  // États pour le système de commande
  const [currentOrder, setCurrentOrder] = useState<any | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 300 secondes = 5 minutes
  const [isOrderActive, setIsOrderActive] = useState<boolean>(false);

  // --- LOGIQUE MÉTIER ---

  /**
   * Génère une nouvelle commande aléatoire parmi les recettes disponibles.
   */
  const generateOrder = useCallback(() => {
    if (recipes.length > 0) {
      const randomIndex = Math.floor(Math.random() * recipes.length);
      setCurrentOrder(recipes[randomIndex]);
      setTimeLeft(300);
      setIsOrderActive(true);
    }
  }, [recipes]);

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
        
        let loadedRecipes = [];
        if (Array.isArray(data)) loadedRecipes = data;
        else if (data && Array.isArray(data.recipes)) loadedRecipes = data.recipes;
        
        setRecipes(loadedRecipes);
      } catch (err) {
        console.error("Erreur lors de la récupération des recettes:", err);
        setRecipes([]);
      }
    };
    fetchRecipes();
  }, []);

  // Lancer la première commande dès que les recettes sont chargées
  useEffect(() => {
    if (recipes.length > 0 && !currentOrder) {
      generateOrder();
    }
  }, [recipes, currentOrder, generateOrder]);

  // Gestion du compte à rebours de la commande
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOrderActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isOrderActive) {
      setIsOrderActive(false);
      alert("Temps écoulé ! La commande a expiré.");
      generateOrder();
    }
    return () => clearInterval(timer);
  }, [isOrderActive, timeLeft, generateOrder]);

  // Actions de nettoyage
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
   * Vérifie la recette et accorde un bonus si elle correspond à la commande actuelle.
   */
  const handleCook = () => {
    if (ingredientsInZone.length === 0) {
      alert("La zone est vide !");
      return;
    }

    const namesInZoneSet = new Set(
      ingredientsInZone.map(item => item.name.trim().toLowerCase())
    );

    const foundRecipe = recipes.find(recipe => {
      if (!recipe.ingredients || !Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
        return false;
      }
      const cleanRecipeIngredients = recipe.ingredients.map((ing: any) => 
        String(ing).trim().toLowerCase()
      );
      const requiredIngredientsSet = new Set(cleanRecipeIngredients);
      if (namesInZoneSet.size !== requiredIngredientsSet.size) return false;
      return [...requiredIngredientsSet].every(ingName => namesInZoneSet.has(ingName));
    });

    if (foundRecipe) {
      let finalGain = 100;
      let alertMessage = `Bravo ! Tu as fait : ${foundRecipe.name}`;

      // Vérification si la recette correspond à la commande en cours
      if (currentOrder && foundRecipe._id === currentOrder._id) {
        finalGain += 5;
        alertMessage = `Excellent ! Commande honorée : ${foundRecipe.name} (+5 points bonus)`;
        generateOrder(); // On passe à la commande suivante
      }

      setScore(prev => prev + finalGain);
      alert(alertMessage);
      
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

  // Formatage du temps restant (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- RENDU (UI) ---

  return (
    <div className="game-container">
      {/* HUD Score */}
      <div className="score-display">SCORE : {score}</div>

      {/* Interface de la Commande Actuelle */}
      <div className="order-panel">
        {currentOrder ? (
          <div className="order-card">
            <h3 className="order-title">COMMANDE : {currentOrder.name}</h3>
            <p className={`order-timer ${timeLeft < 30 ? 'critical' : ''}`}>
              Temps : {formatTime(timeLeft)}
            </p>
            <div className="order-needs">
              Ingrédients : {currentOrder.ingredients.join(', ')}
            </div>
          </div>
        ) : (
          <div className="order-card">Recherche de commande...</div>
        )}
      </div>
      
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