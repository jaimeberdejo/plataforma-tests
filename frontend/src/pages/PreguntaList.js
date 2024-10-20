// src/pages/PreguntaList.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPreguntasByExamen, deletePregunta } from '../services/preguntaService';
import { getExamenById } from '../services/examenService'; 
import './PreguntaList.css';

const PreguntaList = () => {
  const { examenId } = useParams();
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examen, setExamen] = useState(null); // Estado para almacenar la información del examen
  const [colapsadas, setColapsadas] = useState({});  // Estado para manejar las preguntas colapsadas

  useEffect(() => {
    const fetchPreguntas = async () => {
      try {
        const response = await getPreguntasByExamen(examenId);
        setPreguntas(response.data);
        setLoading(false);

        const examenData = await getExamenById(examenId); // Obtener el examen por su ID
        setExamen(examenData); // Guardar los datos del examen, incluyendo el nombre

      } catch (error) {
        console.error('Error al obtener las preguntas:', error);
        setLoading(false);
      }
    };

    fetchPreguntas();
  }, [examenId]);

  const handleDelete = async (preguntaId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta pregunta?')) {
      try {
        await deletePregunta(preguntaId);
        setPreguntas(preguntas.filter((pregunta) => pregunta.id !== preguntaId));
      } catch (error) {
        console.error('Error al eliminar la pregunta:', error);
      }
    }
  };

  // Función para convertir índices a letras (a, b, c, ...)
  const indexToLetter = (index) => {
    return String.fromCharCode(97 + index) + ')';  // 97 es el código ASCII de 'a'
  };

  // Alternar la visibilidad de las respuestas
  const toggleColapsar = (preguntaId) => {
    setColapsadas((prevState) => ({
      ...prevState,
      [preguntaId]: !prevState[preguntaId]  // Cambiar el estado de colapsado/descolapsado
    }));
  };

  if (loading) {
    return <div>Cargando preguntas...</div>;
  }

  return (
    <div className="pregunta-list-container">
      <h2>Preguntas de {examen ? examen.nombre : 'Desconocido'}</h2>
      <Link to={`/examenes/${examenId}/crear-pregunta`} className="create-button">
        Crear Nueva Pregunta
      </Link>
      <ul>
        {preguntas.length === 0 ? (
          <p>No hay preguntas en este examen.</p>
        ) : (
          preguntas.map((pregunta) => (
            <li key={pregunta.id} className="pregunta-card">
              <div className="pregunta-header">
                <strong>{pregunta.texto}</strong>
                <div className="actions">
                  <Link to={`/examenes/${examenId}/editar-pregunta/${pregunta.id}`} className="edit-button">
                    Editar
                  </Link>
                  <button onClick={() => handleDelete(pregunta.id)} className="delete-button">
                    Eliminar
                  </button>
                </div>
              </div>

              <button
                onClick={() => toggleColapsar(pregunta.id)}
                className="toggle-button"
              >
                {colapsadas[pregunta.id] ? 'Ocultar Respuestas' : 'Mostrar Respuestas'}
              </button>

              {colapsadas[pregunta.id] && (
                <ul className="respuestas-list">
                  {pregunta.opciones.map((opcion, index) => (
                    <li key={index}>
                      {indexToLetter(index)} {opcion.texto}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default PreguntaList;
