// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

// Crea el contexto
export const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Estado de autenticación

  useEffect(() => {
    // Aquí podrías comprobar el token en localStorage o cualquier otro método de autenticación
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);  // Si hay un token, el usuario está autenticado
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
