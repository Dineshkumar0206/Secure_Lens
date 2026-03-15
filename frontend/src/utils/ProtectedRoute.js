// utils/ProtectedRoute.js
// ─────────────────────────────────────────────────────
// Wraps a route so only authenticated users can access it.
// Redirects to /login if no valid JWT is found.
// ─────────────────────────────────────────────────────
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

/**
 * ProtectedRoute - HOC that guards pages behind authentication.
 * Usage: <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to login, saving the current path so we can return after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
