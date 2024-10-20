// src/pages/CorrecionExamen.js

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getResultadoExamen, getPreguntasByExamen } from '../services/examenService'; // Asegúrate de tener estas funciones
import './CorreccionExamen.css';

const CorrecionExamen = () => {
  const { examenId, resultadoId } = useParams();
  const [preguntas, setPreguntas] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResultadoData = async () => {
      try {
        const resultadoResponse = await getResultadoExamen(resultadoId);
        setResultado(resultadoResponse.data);

        const preguntasResponse = await getPreguntasByExamen(examenId);
        setPreguntas(preguntasResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos del resultado o las preguntas:', error);
        setLoading(false);
      }
    };

    fetchResultadoData();
  }, [examenId, resultadoId]);

  if (loading) {
    return <div>Cargando resultados del examen...</div>;
  }

  if (!resultado || !preguntas.length) {
    return <div>No se encontraron resultados para este examen.</div>;
  }

  return (
    <div className="correccion-examen-container">
      <h2>Corrección del Examen: {resultado.examen.nombre}</h2>
      <p>Puntaje obtenido: {resultado.puntuaje}</p>
      <p>Tiempo empleado: {new Date(resultado.tiempo_empleado * 1000).toISOString().substr(11, 8)}</p>

      {preguntas.map((pregunta) => (
        <div key={pregunta.id} className="pregunta-card">
          <h3>{pregunta.texto}</h3>
          <ul className="opciones-list">
            {pregunta.opciones.map((opcion) => (
              <li key={opcion.id} className={opcion.es_correcta ? 'opcion-correcta' : 'opcion-incorrecta'}>
                <label>
                  <input
                    type="radio"
                    name={`pregunta-${pregunta.id}`}
                    value={opcion.id}
                    disabled
                    checked={resultado.respuestas[pregunta.id] === opcion.id}
                  />
                  {opcion.texto}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <Link to="/resultados" className="volver-button">Volver a Resultados</Link>
    </div>
  );
};

export default CorrecionExamen;
