import axios from 'axios';

export const getResultado = async (examenId) => {
  return await axios.get(`http://localhost:8000/gestion/api/examenes/${examenId}/resultados/`);
};
