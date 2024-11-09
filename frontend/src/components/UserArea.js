// src/components/UserArea.js
import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

import './UserArea.css';

const UserArea = () => {
  const { username, logout } = useContext(AuthContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null); // Crea una referencia para el menú desplegable

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const closeDropdown = () => setDropdownOpen(false);

  const handleLogout = () => {
    logout();
    closeDropdown(); // Cierra el menú después de hacer logout
    navigate('/');
  };

  // Cierra el menú desplegable al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="user-area" ref={dropdownRef}>
      <button className="user-button" onClick={toggleDropdown}>
        {username || 'Usuario'} ▼
      </button>
      {isDropdownOpen && (
        <div className="dropdown-menu">
          <Link 
            to="/datos-usuario" 
            className="dropdown-item" 
            onClick={closeDropdown}  // Cierra el menú al hacer clic en "Datos de usuario"
          >
            Datos de usuario
          </Link>
          <button 
            onClick={handleLogout} 
            className="dropdown-item logout-button"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default UserArea;
