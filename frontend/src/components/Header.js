// src/components/Header.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/examenes">Exámenes</Link></li>
          <li><Link to="/crear-examen" className="highlight">Crear Examen</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
