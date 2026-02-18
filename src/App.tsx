import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './pages/LoginForm';
import Game from './pages/Game';
import MarketPlace from './pages/Market';
import RegisterForm from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        {/* La racine affiche le Login */}
        <Route path="/" element={<LoginForm />} />
        
        {/* On ajoute explicitement /login pour éviter l'erreur si l'URL est tapée */}
        <Route path="/login" element={<LoginForm />} />
        
        {/* Attention à la casse : utilise "/register" en minuscule pour matcher tes navigate() */}
        <Route path="/register" element={<RegisterForm />} />
        
        <Route path="/game" element={<Game />} />
        <Route path="/MarketPlace" element={<MarketPlace />} />

        {/* Optionnel : Rediriger toute URL inconnue vers le login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;