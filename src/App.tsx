import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './LoginForm'; // On l'importe d'un autre fichier
import Game from './Game';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
}

export default App;