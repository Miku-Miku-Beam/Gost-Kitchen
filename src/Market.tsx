import React, { useEffect, useState } from 'react';

interface Ingredient {
    _id: string;
    name: string;
    category: string;
}

const MarketPlace: React.FC = () => {
    // --- ÉTATS ---
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // --- STYLES ---

    const containerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        minHeight: '100vh',
        width: '100vw',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        margin: 0,
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
        backgroundColor: '#ffffff00',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box'
    };

    const nameStyle: React.CSSProperties = {
        fontSize: '1.5rem',
        color: '#806952',
        fontWeight: 'bold',
        margin: '20px 0'
    };

    const categoryStyle: React.CSSProperties = {
        fontSize: '0.9rem',
        color: '#168f3a',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    };

    // --- LOGIQUE ---

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/laboratory/ingredients');
                
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération');
                }

                const data = await response.json();
                
                // On vérifie si data est le tableau ou contient le tableau
                if (Array.isArray(data)) {
                    setIngredients(data);
                } else if (data.ingredients && Array.isArray(data.ingredients)) {
                    setIngredients(data.ingredients);
                }
            } catch (err) {
                console.error(err);
                setError("Impossible de charger les ingrédients");
            } finally {
                setLoading(false);
            }
        };

        fetchIngredients();
    }, []);

    // --- RENDU ---

    if (loading) return <div style={containerStyle}>Chargement...</div>;
    if (error) return <div style={containerStyle}><p style={{color: 'red'}}>{error}</p></div>;

    return (
        <div style={containerStyle}>
            <h1 style={{ marginBottom: '50px', fontSize: '2.5rem', color:'#806952' }}>MarketPlace</h1>
            
            <div style={gridStyle}>
                {ingredients.map((item) => (
                    <div key={item._id} style={cardStyle}>
                        <span style={categoryStyle}>{item.category}</span>
                        <h3 style={nameStyle}>{item.name}</h3>
                    </div>
                ))}
            </div>

            {ingredients.length === 0 && <p>Aucun ingrédient en stock.</p>}
        </div>
    );
};

export default MarketPlace;