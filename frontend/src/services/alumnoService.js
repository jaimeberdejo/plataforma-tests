// src/services/alumnoService.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/gestion/api/';

// Obtener los alumnos asignados a un profesor específico
export const getAlumnos = async (profesorId) => {
  try {
    const response = await axios.get(`${API_URL}profesores/${profesorId}/alumnos/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los alumnos:', error);
    throw error;
  }
};

// Asignar un nuevo alumno a un profesor específico
export const addAlumno = async (profesorId, alumnoUsername) => {
  try {
    const response = await axios.post(`${API_URL}profesores/${profesorId}/alumnos/`, {
      username: alumnoUsername,
    });
    return response.data;
  } catch (error) {
    console.error('Error al agregar alumno:', error);
    throw error;
  }
};

// Eliminar un alumno asignado a un profesor específico
export const deleteAlumno = async (profesorId, alumnoId) => {
  try {
    await axios.delete(`${API_URL}profesores/${profesorId}/alumnos/${alumnoId}/`);
  } catch (error) {
    console.error('Error al eliminar alumno:', error);
    throw error;
  }
};
