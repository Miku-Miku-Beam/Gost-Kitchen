import React, { useEffect, useState } from 'react';

// Définir la forme de vos données (TypeScrypt)
interface Ingredient {
    _id: string;
    nom: string;     // Assurez-vous que cela correspond à votre BDD
    prix?: number;   // Le ? signifie que c'est optionnel
}

const MarketPlace: React.FC = () => {
    // 1. État pour stocker les données
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    
    // 2. État pour gérer le chargement et les erreurs
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // 3. Effet pour charger les données au montage du composant
    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                // Appel vers votre serveur sur le port 5000
                const response = await fetch('http://localhost:5000/api/laboratory/ingredients');
                
                if (!response.ok) {
                    console.log("erreur réseaulors de la récupéation")
                    throw new Error('Erreur réseau lors de la récupération');
                }

                const data = await response.json();
                setIngredients(data);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger les ingrédients");
            } finally {
                setLoading(false);
            }
        };

        fetchIngredients();
    }, []); // Le tableau vide [] assure que cela ne s'exécute qu'une seule fois

    // 4. Rendu conditionnel
    if (loading) return <p>Chargement des ingrédients...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div style={{ display: 'grid', gap: '10px' }}>
    {Array.isArray(ingredients) ? (
        ingredients.map((item) => (
            <div key={item._id} style={{ border: '1px solid #ccc', padding: '10px' }}>
                <h3>{item.nom}</h3>
                {item.prix && <p>Prix : {item.prix} €</p>}
            </div>
        ))
    ) : (
        <p>Erreur : Le format des données reçues est incorrect (pas un tableau).</p>
    )}
    </div>
    );
};

export default MarketPlace;