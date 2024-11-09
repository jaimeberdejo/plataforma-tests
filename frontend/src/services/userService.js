import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000/gestion/api'; // Configura la URL base de Axios

export const getUserData = async (userId) => {
  try {
    const response = await axios.get(`/usuarios/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    throw error;
  }
};

export const updateUserData = async (userId, data) => {
  try {
    const response = await axios.put(`/usuarios/${userId}/`, data);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar los datos del usuario:', error);
    throw error;
  }
};

export const updatePassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await axios.put(`/usuarios/${userId}/password/`, {
      current_password: currentPassword,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    throw error;
  }
};
