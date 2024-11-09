// src/pages/DatosUsuario.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserData, updateUserData, updatePassword } from '../services/userService';
import './DatosUsuario.css';

const DatosUsuario = () => {
  const { userId, updateUsername } = useContext(AuthContext); 
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    if (userId) { 
      const fetchUserData = async () => {
        const data = await getUserData(userId);
        setUserData(data);
      };
      fetchUserData();
    }
  }, [userId]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSave = async () => {
    await updateUserData(userId, userData);
    if (userData.username) {
      updateUsername(userData.username); // Ahora `updateUsername` está definido
    }
    setIsEditing(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    await updatePassword(userId, currentPassword, newPassword);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
  };

  return (
    <div className="user-details-container">
      <h2>Datos de Usuario</h2>
      {userData && (
        <form className="user-details-form">
          <label>
            Nombre de usuario:
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
              disabled={!isEditing}
            />
          </label>
          {isEditing ? (
            <button type="button" onClick={handleSave}>Guardar</button>
          ) : (
            <button type="button" onClick={handleEditToggle}>Editar</button>
          )}
        </form>
      )}

      <h3>Modificar Contraseña</h3>
      <form className="password-form" onSubmit={handlePasswordChange}>
        <label>
          Contraseña actual:
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Nueva contraseña:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirmar contraseña:
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {passwordError && <p className="error-message">{passwordError}</p>}
        <button type="submit">Cambiar Contraseña</button>
      </form>
    </div>
  );
};

export default DatosUsuario;
