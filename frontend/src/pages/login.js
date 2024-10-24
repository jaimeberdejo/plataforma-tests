// src/pages/Login.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';  // Asegúrate de implementar esta función en tu servicio
import './Auth.css';  // El CSS será compartido para Login y Register

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await loginUser({ username, password });
      navigate('/');  // Redirigir a la página principal después de iniciar sesión
    } catch (err) {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Iniciar Sesión</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Nombre de usuario</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-btn">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default Login;
