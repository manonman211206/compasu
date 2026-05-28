// client/src/App.jsx
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<Landing />} />
        
        {/* Auth Page: If logged in, redirect to Dashboard */}
        <Route 
          path="/login" 
          element={token ? <Navigate to="/dashboard" /> : <Auth setToken={setToken} />} 
        />
        
        {/* Dashboard: If NOT logged in, redirect to Login */}
        <Route 
          path="/dashboard" 
          element={token ? <Dashboard handleLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;