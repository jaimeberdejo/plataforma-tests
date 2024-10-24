import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';  // Importa el AuthContext
import './Header.css';

const Header = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);  // Obtén el estado de autenticación y la función de logout

  const handleLogout = () => {
    logout();  // Llama a la función logout para cerrar sesión
  };

  return (
    <header className="header">
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link to="/examenes">Exámenes</Link></li>
              <li><Link to="/crear-examen" className="highlight">Crear Examen</Link></li>
              <li><button onClick={handleLogout} className="logout-button">Cerrar Sesión</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Iniciar Sesión</Link></li>
              <li><Link to="/register">Registrarse</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
