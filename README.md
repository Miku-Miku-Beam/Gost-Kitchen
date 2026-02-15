# Ghost Kitchen - La Tour d'Émeraude

## Description du Projet

**Ghost Kitchen** est un jeu de gestion de restaurant en temps réel où vous devez redécouvrir les recettes perdues, gérer vos stocks, servir vos clients sous pression et maintenir votre restaurant rentable.

### Concept

Vous reprenez un restaurant légendaire « La Tour d'Émeraude », mais le chef précédent est parti avec le livre de recettes ! Vos placards et frigos sont vides. Vous devez :

- Expérimenter au laboratoire pour redécouvrir les recettes
- Acheter intelligemment vos ingrédients
- Servir les clients en temps réel pour éviter la faillite
- Gérer votre trésorerie et vos stocks

---

## Stack Technique

### Backend

- **Node.js** avec **TypeScript**
- **Express.js** - Framework web
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **Socket.io** - WebSockets pour le temps réel
- **JWT (jsonwebtoken)** - Authentification sécurisée
- **bcryptjs** - Hashage des mots de passe

### Frontend

- **React** avec **TypeScript**
- **Vite** - Build tool
- **React Router** - Navigation
- **Axios** - Requêtes HTTP
- **Socket.io-client** - Client WebSocket

---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (v18 ou supérieur) - [Télécharger ici](https://nodejs.org/)
- **MongoDB** (v6 ou supérieur) - [Télécharger ici](https://www.mongodb.com/try/download/community)
- **npm** (inclus avec Node.js)

---

## Installation

### 1️ Cloner le repository

```bash
git clone <https://github.com/Miku-Miku-Beam/Gost-Kitchen.git>
cd Gost_Kitchen
```

### 2 Installer les dépendances

```bash
npm install
```

### 3️ Configurer les variables d'environnement

Créez le fichier `server/.env` :

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ghost-kitchen
JWT_SECRET=votre_secret_super_securise
NODE_ENV=development
```

---

## Configuration de la Base de Données

### 1️ Démarrer MongoDB

**Sur Windows :**

```bash
# MongoDB doit être démarré en tant que service
# Vérifiez qu'il tourne avec :
mongosh
```

**Sur macOS :**

```bash
brew services start mongodb-community
```

**Sur Linux :**

```bash
sudo systemctl start mongod
```

### 2️ Initialiser la base de données (Seed)

Le seed remplit la base avec :

- **15 ingrédients** avec leurs prix
- **7 recettes** avec leurs prix de vente
- Toutes les données de base nécessaires au jeu

```bash
npm run seed
```

**Sortie attendue :**

```
MongoDB connecté: localhost
Nettoyage de la base de données...
Création des ingrédients...
15 ingrédients créés
Création des recettes...
7 recettes créées

Base de données initialisée avec succès !
Total: 15 ingrédients, 7 recettes
```

---

## Démarrage du Serveur

### Mode Développement (Backend uniquement)

```bash
npm run server
```

**Sortie attendue :**

```
Serveur démarré sur le port 5000
Frontend attendu sur http://localhost:5173
WebSocket prêt pour les commandes
MongoDB connecté: localhost
```

### Mode Développement (Frontend + Backend)

```bash
npm run dev:full
```

Cela lance simultanément :

- Le serveur backend sur `http://localhost:5000`
- Le serveur frontend sur `http://localhost:5173`

---

## Structure du Projet

```
Gost_Kitchen/
├── src/                          # Frontend React
│   ├── components/
│   ├── services/
│   │   └── api.ts
│   └── ...
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

---
