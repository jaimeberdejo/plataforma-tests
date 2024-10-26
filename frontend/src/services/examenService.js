// src/services/examenService.js

import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/gestion/api/';



export const getExamenes = async () => {
  try {
    const response = await axios.get(`${API_URL}examenes/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los exámenes:', error.response ? error.response.data : error.message);
    throw error;
  }
};


export const getExamenesByUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}examenes/?user_id=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los exámenes:', error.response ? error.response.data : error.message);
    throw error;
  }
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
    console.error('Error en la creación del examen:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateExamen = async (id, examenData) => {
  try {
    const response = await axios.put(`${API_URL}examenes/${id}/`, examenData);
    return response.data;
  } catch (error) {
    console.error('Error en la actualización del examen:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteExamen = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}examenes/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el examen:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getPreguntasByExamen = async (examenId) => {
  try {
    const response = await axios.get(`${API_URL}examenes/${examenId}/preguntas`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener las preguntas:", error.response ? error.response.data : error.message);
    return { data: [] }; // Devuelve un array vacío en caso de error
  }
};


export const getResultadoExamen = async (resultadoId) => {
  return await axios.get(`${API_URL}resultados/${resultadoId}/`);
};




export const enviarRespuestas = async (examenId, respuestasJSON) => {
  try {
    const response = await axios.post(`${API_URL}examenes/${examenId}/resultados/`, respuestasJSON, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al enviar las respuestas:', error);
    throw error;
  }
};


export const uploadTxtExamen = async (formData) => {
  return axios.post('http://localhost:8000/gestion/api/uploadtxt/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};


export const getExamenesAsignados = async (alumnoId) => {
  try {
    const response = await axios.get(`${API_URL}examenes/examenes-asignados/`, {
      params: { alumno_id: alumnoId },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los exámenes asignados:', error);
    throw error;
  }
};

export const getResultadosByExamen = async (examenId) => {
  try {
    const response = await axios.get(`${API_URL}examenes/${examenId}/resultados/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los resultados del examen:', error);
    throw error;
  }
};

