import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from '../src/pages/login';
import EndUserDashboard from './pages/enduserdahboard';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<EndUserDashboard />} />
        {/* Add Dashboard or other pages later */}
      </Routes>
    </Router>
  );
}

export default App;
