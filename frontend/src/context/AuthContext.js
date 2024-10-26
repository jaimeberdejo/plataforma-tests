// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

// Crea el contexto
export const AuthContext = createContext();

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('user_id');
    console.log('Token en localStorage:', token);
    console.log('ROL en localstorage:', storedRole);
    console.log('user id en localstorage:', storedUserId);

    if (token) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      setUserId(storedUserId);
    }
  }, []);

  const login = (token, role, user_id) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('user_id', user_id);
    console.log('Token y rol guardados en localStorage. Usuario autenticado como:', role);
    setIsAuthenticated(true);
    setUserRole(role);
    setUserId(user_id);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    console.log('Usuario desconectado y token, rol y user_id eliminados de localStorage');
    
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
