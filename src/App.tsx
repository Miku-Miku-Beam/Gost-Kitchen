import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './Pages/LoginForm'; // On l'importe d'un autre fichier
import Game from './Pages/Game';
import MarketPlace from './Pages/Market';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/game" element={<Game />} />
        <Route path="/MarketPlace" element={<MarketPlace />} />
      </Routes>
    </Router>
  );
}

export default App;