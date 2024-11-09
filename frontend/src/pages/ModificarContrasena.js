// src/pages/ModificarContrasena.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { updatePassword } from '../services/userService';

const ModificarContrasena = () => {
  const { userId } = useContext(AuthContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updatePassword(userId, currentPassword, newPassword);
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div>
      <h2>Modificar Contraseña</h2>
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Cambiar Contraseña</button>
      </form>
    </div>
  );
};

export default ModificarContrasena;
