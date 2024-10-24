// src/pages/Register.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';  // Asegúrate de implementar esta función en tu servicio
import './Auth.css';  // El CSS será compartido para Login y Register

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('alumno');  // Valores: 'profesor', 'alumno', 'independiente'
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    try {
      await registerUser({ username, password, role });
      navigate('/login');  // Redirigir al login después de registrarse
    } catch (err) {
      setError('Error al registrar. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="auth-container">
      <h2>Registro</h2>
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
        <div className="form-group">
          <label>Confirmar Contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Rol</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="alumno">Alumno</option>
            <option value="profesor">Profesor</option>
            <option value="independiente">Usuario Independiente</option>
          </select>
        </div>
        <div className="role-explanation">
        <h3>¿Qué puede hacer cada tipo de usuario?</h3>
        <div className="role-card">
          <h4>Alumno</h4>
          <p>Solo puede realizar exámenes que un profesor le haya asignado. No puede crear ni editar exámenes.</p>
        </div>
        <div className="role-card">
          <h4>Profesor</h4>
          <p>Puede crear, editar y asignar exámenes a alumnos específicos. Además, pueden ver las estadísticas y resultados de los alumnos.</p>
        </div>
        <div className="role-card">
          <h4>Usuario Independiente</h4>
          <p>Puede crear, editar y realizar sus propios exámenes, pero no pueden asignar exámenes a otros usuarios.</p>
        </div>
      </div>
        <button type="submit" className="auth-btn">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
