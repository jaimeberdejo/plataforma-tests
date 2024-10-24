// src/services/authService.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/gestion/auth';  // Cambia la URL según la configuración de tu backend

// Registrar un nuevo usuario
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register/`, userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Iniciar sesión y obtener el token de autenticación
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login/`, userData);
    // Guardar el token en localStorage
    localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Obtener el usuario actual a partir del token almacenado
export const getCurrentUser = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    // Decodificar el token para obtener la información del usuario
    // Asegúrate de que tu backend incluya la información del usuario en el token JWT
    const user = JSON.parse(atob(token.split('.')[1]));  // Decodificar el payload del JWT
    return user;
  } catch (error) {
    return null;
  }
};

// Cerrar sesión
export const logoutUser = () => {
  localStorage.removeItem('token');
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;  // Devuelve true si el token existe
};

