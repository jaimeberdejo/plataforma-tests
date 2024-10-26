import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import './Header.css';

const Header = () => {
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // Declara navigate con useNavigate

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirige a la página de inicio
  };

  return (
    <header className="header">
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>

          {isAuthenticated && userRole === 'profesor' && (
            <>
              <li><Link to="/examenes">Exámenes</Link></li>
              <li><Link to="/alumnos">Alumnos</Link></li>
              <li className="logout-container">
                <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
              </li>
            </>
          )}

          {isAuthenticated && userRole === 'alumno' && (
            <>
              <li><Link to="/examenes-asignados">Exámenes</Link></li>
              <li className="logout-container">
                <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
              </li>
            </>
          )}

          {isAuthenticated && userRole === 'independiente' && (
            <>
              <li><Link to="/examenes">Exámenes</Link></li>
              <li><Link to="/crear-examen">Crear Examen</Link></li>
              <li className="logout-container">
                <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
              </li>
            </>
          )}

          {!isAuthenticated && (
            <>
              <li><Link to="/login" className="login-button">Iniciar Sesión</Link></li>
              <li><Link to="/register" className="register-button">Registrarse</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
