import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles/index.css';

import Register from './app/pages/Register';
import Login from './app/pages/Login';
import GuessThePokemon from './app/pages/guessThePokemon';
<<<<<<< HEAD
import Admin from './app/pages/Admin';
=======
import Profile from './app/pages/Profile';
>>>>>>> a4fadf1da895c7fc48c082a5fc3f96eb433c7762

const isAuthenticated = () => !!localStorage.getItem('user');

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/guess"
          element={<ProtectedRoute><GuessThePokemon /></ProtectedRoute>}
        />
        <Route
<<<<<<< HEAD
          path="/Admin"
          element={<ProtectedRoute><Admin /></ProtectedRoute>}
=======
          path="/profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>}
>>>>>>> a4fadf1da895c7fc48c082a5fc3f96eb433c7762
        />
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
