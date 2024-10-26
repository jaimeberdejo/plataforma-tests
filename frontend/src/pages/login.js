import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const { login } = useContext(AuthContext);  // Obtiene la función login del contexto
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await loginUser({ username, password });
        const token = response.token;
        const role = response.role;
        const user_id = response.user_id;
        console.log('Token recibido en Login.js:', token);  
        console.log('Rol recibido en Login.js:', role);
        console.log('user_id recibido en Login.js:', user_id);  
      if (token) {
        login(token, role, user_id);  // Llama a la función login con el token
        navigate('/');
      } else {
        console.log('Error: No se recibió un token');  // Si el token no se recibe
      }
    } catch (err) {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
      console.log('Error en loginUser desde Login.js:', err);  // Captura el error
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