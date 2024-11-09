import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import UserArea from './UserArea';  // Asegúrate de importar UserArea

import './Header.css';

const Header = () => {
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
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
              <UserArea />  {/* Área de usuario */}
              <li className="logout-container">
              </li>
            </>
          )}

          {isAuthenticated && userRole === 'alumno' && (
            <>
              <li><Link to="/examenes-asignados">Exámenes</Link></li>
              <UserArea />  {/* Área de usuario */}
              <li className="logout-container">
              </li>
            </>
          )}

          {isAuthenticated && userRole === 'independiente' && (
            <>
              <li><Link to="/examenes">Exámenes</Link></li>
              <li><Link to="/crear-examen">Crear Examen</Link></li>
              <UserArea />  {/* Área de usuario */}
              <li className="logout-container">
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
