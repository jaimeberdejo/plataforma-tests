import axios from 'axios';

export const getResultado = async (examenId) => {
  return await axios.get(`http://localhost:8000/gestion/api/examenes/${examenId}/resultados/`);
};



const API_URL = 'http://localhost:8000/gestion/api/';

export const getResultadoById = async (resultadoId) => {
  try {
    const response = await axios.get(`${API_URL}resultados/${resultadoId}/`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el detalle del resultado:', error);
    throw error;
  }
};