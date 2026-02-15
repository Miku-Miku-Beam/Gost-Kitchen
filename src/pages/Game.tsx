import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Game.css';

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
  
  // Liste complète des ingrédients possédés par le joueur
  const [inventory, setInventory] = useState<any[]>([]);
  // Score actuel de la session
  const [score, setScore] = useState(0);
  // Liste des recettes possibles récupérées depuis l'API
  const [recipes, setRecipes] = useState<any[]>([]);
  // Ingrédients actuellement placés dans la DropZone pour cuisiner
  const [ingredientsInZone, setIngredientsInZone] = useState<{id: string, name: string}[]>([]);

  // --- EFFETS (LIFECYCLE) ---

  // Initialisation : Récupération de l'inventaire local au chargement du composant
  useEffect(() => {
    const saved = localStorage.getItem('inventory');
    if (saved) setInventory(JSON.parse(saved));
  }, []);

  // Chargement des données métier : Récupération des recettes via l'API Flask
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/laboratory/recipes/all');
        const data = await response.json();
        
        // Gestion de la structure de réponse API (tableau direct ou objet contenant une clé 'recipes')
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

  // Réinitialise l'inventaire du joueur (Local et State)
  const clearInventory = () => {
    localStorage.removeItem('inventory');
    setInventory([]);
    setIngredientsInZone([]);
  };

  // Ajoute un ingrédient à la zone de préparation lors d'un "Drop" réussi
  const handleDropInZone = (id: string, name: string) => {
    setIngredientsInZone(prev => {
      // Évite les doublons de la même instance (même ID) dans la zone
      const isAlreadyThere = prev.some(item => item.id === id);
      if (!isAlreadyThere) {
        return [...prev, { id, name }];
      }
      return prev;
    });
  };

  // Vérifie si la zonz zqt triger par des ingrédient puis il les compares et met jour le score et l'inventaire de succès
  const handleCook = () => {
    if (ingredientsInZone.length === 0) {
      alert("La zone est vide !");
      return;
    }

    // Extraction des noms pour la comparaison (la recette se base sur le nom, pas sur l'ID unique)
    const currentIngredientNames = ingredientsInZone.map(item => item.name);

    // Recherche d'une recette correspondante
    const foundRecipe = recipes.find(recipe => {
      // Vérification simple sur la quantité d'ingrédients
      if (!recipe.ingredients || recipe.ingredients.length !== currentIngredientNames.length) return false;
      
      // Tri alphabétique pour comparer les tableaux sans se soucier de l'ordre de dépôt
      const recipeIngs = [...recipe.ingredients].sort();
      const zoneIngs = [...currentIngredientNames].sort();
      
      return recipeIngs.every((val, index) => val === zoneIngs[index]);
    });

    if (foundRecipe) {
      setScore(prev => prev + 100);
      alert(`Bravo ! Tu as fait : ${foundRecipe.name}`);
      
      // Nettoyage de l'inventaire : On retire les IDs précis utilisés pour la recette
      const usedIds = ingredientsInZone.map(i => i.id);
      const remainingInventory = inventory.filter(item => !usedIds.includes(item._id));
      
      setInventory(remainingInventory);
      localStorage.setItem('inventory', JSON.stringify(remainingInventory));
      
      // Reset de la zone de drop
      setIngredientsInZone([]);
    } else {
      alert("Combinaison inconnue...");
      setIngredientsInZone([]);
    }
  };

  // --- RENDU (UI) ---

  return (
    <div className="game-container">
      {/* Affichage HUD (Score & Navigation) */}
      <div className="score-display">SCORE : {score}</div>
      
      <button className="back-button" onClick={() => navigate('/')} title="Retour à l'accueil">
        <img src={retour} alt="Retour" className="back-icon"/>
      </button>

      {/* Actions globales sur l'inventaire */}
      {inventory.length > 0 && (
        <button className="clear-button" onClick={clearInventory}>
          Vider le frigo
        </button>
      )}

      {/* Plan de travail (Étagère + Zone de Drop) */}
      <div className="inventory-banner">
        <button className="cook-button" onClick={handleCook}>
          CUISINER 🍳
        </button>

        <button className="market-button" onClick={() => navigate('/MarketPlace')} title="Aller au marché">
            <img src={Marcket} alt="Market" className="market-icon" />
        </button>
        
        {/* Décoration étagère */}
        <div className="banner-shelf"></div>

        {/* Génération dynamique des boîtes d'ingrédients déplaçables */}
        {inventory.map((item, index) => (
          <DragBox 
            key={`${item._id}-${index}`} // Clé unique React
            id={item._id} 
            name={item.name} 
            initialX={100 + (index * 180)} // Positionnement horizontal automatique
            onDrop={handleDropInZone} 
          />
        ))}

        {/* Cible de dépôt pour les DragBox */}
        <DropZone/>
      </div>
    </div>
  );
};

export default Game;