// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null); // Agregar estado para el nombre de usuario

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('user_id');
    const storedUsername = localStorage.getItem('username'); // Obtener username del almacenamiento

    if (token) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      setUserId(storedUserId);
      setUsername(storedUsername); // Establecer el nombre de usuario
    }
  }, []);

  const login = (token, role, user_id, user_name) => { // Agregar user_name como parámetro
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('user_id', user_id);
    localStorage.setItem('username', user_name); // Almacenar username en el localStorage

    setIsAuthenticated(true);
    setUserRole(role);
    setUserId(user_id);
    setUsername(user_name); // Actualizar el estado del nombre de usuario
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username'); // Eliminar username del almacenamiento

    setIsAuthenticated(false);
    setUserRole(null);
    setUserId(null);
    setUsername(null); // Restablecer el estado de username
  };

  const updateUsername = (newUsername) => {
    localStorage.setItem('username', newUsername);
    setUsername(newUsername);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, userId, username, login, logout, updateUsername }}>
      {children}
    </AuthContext.Provider>
  );
};
