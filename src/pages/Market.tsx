import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Market.css';
import { API_BASE_URL } from '../config';

/**
 * Interface définissant la structure d'un objet Ingrédient
 */
interface Ingredient {
  _id: string;
  name: string;
  category: string;
}

/**
 * Composant de la boutique (MarketPlace)
 * Permet de récupérer des ingrédients depuis l'API et de les ajouter à l'inventaire
 */
const MarketPlace: React.FC = () => {
  // --- ÉTATS (STATES) ---
  const [ingredients, setIngredients] = useState<Ingredient[]>([]); // Liste des ingrédients récupérés
  const [loading, setLoading] = useState<boolean>(true);            // État de chargement
  const [error, setError] = useState<string | null>(null);         // Gestion des messages d'erreur
  const navigate = useNavigate();

  // --- LOGIQUE D'AJOUT ---
  /**
   * Sauvegarde l'ingrédient sélectionné dans le localStorage (persistance)
   * et redirige l'utilisateur vers la page principale du jeu.
   */
  const addToCart = (ingredient: Ingredient) => {
    // Récupération de l'inventaire actuel ou création d'un nouveau tableau
    const saved = localStorage.getItem('inventory');
    const inventory = saved ? JSON.parse(saved) : [];
    
    // Ajout de l'item et mise à jour du stockage local
    inventory.push(ingredient);
    localStorage.setItem('inventory', JSON.stringify(inventory));
    
    // Retour au jeu
    navigate('/game');
  };

  // --- EFFETS (LIFECYCLE) ---
  
  /**
   * Récupère la liste des ingrédients disponibles avec une requête API (HTTP)
   */
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch(`${API_BASE_URL} /laboratory/ingredients`);
        if (!response.ok) throw new Error('Erreur réseau');
        
        const data = await response.json();
        
        // Gestion de la structure de réponse (tableau simple ou objet avec clé .ingredients)
        setIngredients(Array.isArray(data) ? data : data.ingredients || []);
      } catch (err) {
        setError("Connexion au serveur impossible");
      } finally {
        setLoading(false); // Fin du chargement quel que soit le résultat
      }
    };
    
    fetchIngredients();
  }, []);

  // --- RENDUS CONDITIONNELS (Chargement et Erreur) ---
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

  // --- RENDU PRINCIPAL (INTERFACE) ---
  return (
    <div className="market-container">
      <h1 className="market-title">MarketPlace</h1>
      
      {/* Grille affichant les cartes d'ingrédients */}
      <div className="market-grid">
        {ingredients.map((item) => (
          <div 
            key={item._id} 
            className="ingredient-card"
            onClick={() => addToCart(item)} // Clic pour ajouter à l'inventaire
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