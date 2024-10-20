// src/services/preguntaService.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/gestion/api';  // URL de tu API

export const getPreguntasByExamen = async (examenId) => {
  return await axios.get(`${API_URL}/examenes/${examenId}/preguntas/`);
};

export const getPreguntaById = async (preguntaId) => {
  return await axios.get(`${API_URL}/preguntas/${preguntaId}/`);
};

export const createPregunta = async (preguntaData) => {
  return await axios.post(`${API_URL}/preguntas/`, preguntaData);
};

export const updatePregunta = async (preguntaId, preguntaData) => {
  return await axios.put(`${API_URL}/preguntas/${preguntaId}/`, preguntaData);
};

export const deletePregunta = async (preguntaId) => {
  return await axios.delete(`${API_URL}/preguntas/${preguntaId}/`);
};


