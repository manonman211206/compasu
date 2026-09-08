import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Landing from './Landing';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import { logout } from './store/authSlice';

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const reduxToken = useSelector((state) => state.auth.token);
  const token = reduxToken || localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public route wrapper (redirects to dashboard if already logged in)
const PublicAuthRoute = ({ children }) => {
  const reduxToken = useSelector((state) => state.auth.token);
  const token = reduxToken || localStorage.getItem('token');

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing */}
        <Route path="/" element={<Landing />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <PublicAuthRoute>
              <Signup initialMode="login" />
            </PublicAuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicAuthRoute>
              <Signup initialMode="signup" />
            </PublicAuthRoute>
          }
        />

        {/* Protected Application Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;