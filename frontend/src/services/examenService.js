// src/services/examenService.js

import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/gestion/api/';

export const getExamenes = async () => {
  const response = await axios.get(`${API_URL}examenes/`);
  return response.data;
};



export const getExamenById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}examenes/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el examen:', error.response ? error.response.data : error.message);
    throw error;
  }
};



export const createExamen = async (examenData) => {
  try {
    const response = await axios.post(`${API_URL}examenes/`, examenData);
    return response.data;
  } catch (error) {
    console.error('Error en la creación del examen:', error.response.data);  // Mostrar detalles del error
    throw error;
  }
};

export const updateExamen = async (id, examenData) => {
  const response = await axios.put(`${API_URL}examenes/${id}/`, examenData);
  return response.data;
};

// Eliminar un examen
export const deleteExamen = async (id) => {
  return await axios.delete(`${API_URL}examenes/${id}/`);
};

export const getPreguntasByExamen = async (examenId) => {
  try {
    const response = await axios.get(`http://localhost:8000/gestion/api/examenes/${examenId}/preguntas`);
    return response; // Asegúrate de que estás devolviendo los datos de la API correctamente
  } catch (error) {
    console.error("Error al obtener las preguntas:", error);
    return { data: [] }; // Devuelve un array vacío en caso de error
  }
};


export const getResultadoExamen = async (resultadoId) => {
  return await axios.get(`${API_URL}resultados/${resultadoId}/`);
};




export const enviarRespuestas = async (examenId, respuestasJSON) => {
  try {
    const response = await axios.post(`http://localhost:8000/gestion/api/examenes/${examenId}/resultados/`, respuestasJSON, {
      headers: {
        'Content-Type': 'application/json',  // Asegúrate de que el contenido sea JSON
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al enviar las respuestas:', error);
    throw error;
  }
};