import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import SubmitPrediction from './pages/SubmitPrediction';
import Leaderboard from './pages/Leaderboard';
import AddRace from './pages/AddRace';
import AdminSubmitResults from './pages/AdminSubmitResults';
import AddDriver from './pages/AddDriver';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/submit" element={<SubmitPrediction />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/add-race" element={<AddRace />} />
        <Route path="/add-results" element={<AdminSubmitResults />} />
        <Route path="/add-driver" element={<AddDriver />} />
      </Routes>
    </Router>
  );
}

export default App;
