import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  };

  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading Compasu...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" replace /> : <Signup />}
        />
        <Route
          path="/signup"
          element={token ? <Navigate to="/dashboard" replace /> : <Signup />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={token ? <Dashboard handleLogout={handleLogout} /> : <Navigate to="/login" replace />}
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;