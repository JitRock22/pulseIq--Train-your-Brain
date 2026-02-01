import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Login from '../pages/Login'     // We will create this next
import Dashboard from '../pages/Dashboard'; // We will create this next
import GameArena from '../pages/GameArena'; // We will create this next

function App() {
  return (
    <Router>
      <div className="min-h-screen w-full bg-slate-900 text-white">
        <Routes>
          {/* Default route goes to Login for now */}
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/game/:roomId" element={<GameArena />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;