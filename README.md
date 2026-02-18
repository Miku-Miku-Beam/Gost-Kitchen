# Ghost Kitchen - La Tour d'Émeraude

## Description du Projet

**Ghost Kitchen** est un jeu de gestion de restaurant en temps réel où vous devez redécouvrir les recettes perdues, gérer vos stocks, servir vos clients sous pression et maintenir votre restaurant rentable.

### Concept

Vous reprenez un restaurant légendaire « La Tour d'Émeraude », mais le chef précédent est parti avec le livre de recettes ! Vos placards et frigos sont vides. Vous devez :

* Expérimenter au laboratoire pour redécouvrir les recettes.
* Acheter intelligemment vos ingrédients au Marché.
* Servir les commandes clients en moins de 5 minutes pour gagner des bonus.
* Gérer votre score et votre progression.

---

## Stack Technique

### Backend

* **Node.js** avec **TypeScript**
* **Express.js** - Framework web
* **MongoDB** - Base de données NoSQL
* **Socket.io** - WebSockets pour le temps réel

### Frontend

* **React** avec **TypeScript**
* **Vite** - Build tool (développement ultra-rapide)
* **React Router** - Navigation entre les pages
* **Local Storage** - Persistance de l'inventaire joueur

---

## Prérequis

* **Node.js** (v18 ou supérieur)
* **MongoDB** (v6 ou supérieur)
* **npm** (installé avec Node)

---

## Installation

### 1. Cloner le repository

```bash
git clone <https://github.com/Miku-Miku-Beam/Gost-Kitchen.git>
cd Gost_Kitchen

```

### 2. Installer les dépendances

```bash
npm install

```

### 3. Configurer les variables d'environnement

**Pour le Backend :**
Créez un fichier `server/.env` :

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ghost-kitchen
JWT_SECRET=votre_secret_securise

```

**Pour le Frontend :**
Créez un fichier `.env` à la racine du projet (Gost_Kitchen/) :

```env
VITE_API_URL=http://localhost:5000/api

```

---

## Configuration de la Base de Données

### 1. Démarrer MongoDB

Assurez-vous que votre instance MongoDB tourne localement sur le port 27017.

### 2. Initialiser les données (Seed)

```bash
npm run seed

```

---

## Démarrage du Projet

### Mode Complet

Lancez le backend et le frontend simultanément :

```bash
npm run dev:full

```

* **Frontend** : `http://localhost:5173`
* **Backend API** : `http://localhost:5000`

---

## Structure du Projet

```
Gost_Kitchen/
├── src/                          # Frontend React
│   ├── assets/                   # Ressources statiques (Images, SVG)
│   │   ├── logo poèle.svg        
│   │   ├── Market Icon.png       
│   │   ├── react.svg             
│   │   └── retour.png            
│   │
│   ├── components/               # Composants réutilisables
│   │   ├── DragBox.tsx           
│   │   └── DropZone.tsx         
│   │
│   ├── pages/                    # Vues principales (Pages)
│   │   ├── Game.tsx              
│   │   ├── LoginForm.tsx         
│   │   ├── Market.tsx            
│   │   └── Register.tsx          
│   │
│   ├── services/                 # Appels API et WebSockets
│   ├── styles/                   # Fichiers CSS (Game.css, Market.css, etc.)
│   ├── App.tsx                  
│   ├── config.ts                 
│   ├── main.tsx                  
│                
│
├── server/                       # Backend Node.js
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts      # Connexion MongoDB
│   │   ├── models/              # Modèles Mongoose
│   │   │   ├── User.ts
│   │   │   ├── UserProgress.ts
│   │   │   ├── Ingredient.ts
│   │   │   ├── Recipe.ts
│   │   │   ├── Order.ts
│   │   │   └── Transaction.ts
│   │   ├── controllers/         # Logique métier
│   │   │   ├── auth.controller.ts
│   │   │   ├── laboratory.controller.ts
│   │   │   ├── orders.controller.ts
│   │   │   ├── marketplace.controller.ts
│   │   │   └── dashboard.controller.ts
│   │   ├── routes/              # Routes API
│   │   │   ├── auth.routes.ts
│   │   │   ├── laboratory.routes.ts
│   │   │   ├── orders.routes.ts
│   │   │   ├── marketplace.routes.ts
│   │   │   └── dashboard.routes.ts
│   │   ├── middlewares/         # Middlewares
│   │   │   └── auth.middleware.ts
│   │   ├── sockets/             # Logique WebSocket
│   │   │   └── orderSocket.ts
│   │   ├── seeds/               # Scripts de seed
│   │   │   └── seedData.ts
│   │   └── server.ts            # Point d'entrée serveur
│   └── .env                     # Variables d'environnement
│
├── package.json
└── README.md

```