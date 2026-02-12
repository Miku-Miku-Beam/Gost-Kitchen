import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm'; // On l'importe d'un autre fichier
import Game from './Game';
import MarketPlace from './Market';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/game" element={<Game />} />
        <Route path="/Market" element={<MarketPlace />} />
      </Routes>
    </Router>
  );
}

export default App;