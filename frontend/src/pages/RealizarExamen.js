import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPreguntasByExamen, enviarRespuestas, getExamenById } from '../services/examenService';
import './RealizarExamen.css';

const RealizarExamen = () => {
  const { examenId } = useParams();
  const navigate = useNavigate();

  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [preguntasPorPagina, setPreguntasPorPagina] = useState(1);
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);
  const [randomizarPreguntas, setRandomizarPreguntas] = useState(false);
  const [randomizarOpciones, setRandomizarOpciones] = useState(false);

  useEffect(() => {
    const fetchExamenData = async () => {
      try {
        const examenData = await getExamenById(examenId);

        if (examenData) {
          setPreguntasPorPagina(examenData.preguntas_por_pagina || 1); 
          setRandomizarPreguntas(examenData.randomizar_preguntas);  // Establece si las preguntas deben randomizarse
          setRandomizarOpciones(examenData.randomizar_opciones);  // Establece si las opciones deben randomizarse
        } else {
          console.error('Datos del examen incompletos o no disponibles.');
        }

        const response = await getPreguntasByExamen(examenId);
        let preguntasObtenidas = response.data;

        // Si el examen tiene randomizar_preguntas en true, mezclar las preguntas
        if (randomizarPreguntas) {
          preguntasObtenidas = mezclarArray(preguntasObtenidas);
        }

        // Si el examen tiene randomizar_opciones en true, mezclar las opciones dentro de cada pregunta
        if (randomizarOpciones) {
          preguntasObtenidas = preguntasObtenidas.map((pregunta) => ({
            ...pregunta,
            opciones: mezclarArray(pregunta.opciones),
          }));
        }

        setPreguntas(preguntasObtenidas);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos del examen o las preguntas:', error);
        setLoading(false);
      }
    };

    fetchExamenData();
  }, [examenId, randomizarPreguntas, randomizarOpciones]);

  const mezclarArray = (array) => {
    // Algoritmo de Fisher-Yates para mezclar un array
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const totalPaginas = Math.ceil(preguntas.length / preguntasPorPagina);

  const handleSelectRespuesta = (preguntaId, opcionId) => {
    setRespuestas({
      ...respuestas,
      [preguntaId]: opcionId,
    });
  };

  const handleNextPage = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual(paginaActual + 1);
    }
  };

  const handlePreviousPage = () => {
    if (paginaActual > 1) {
      setPaginaActual(paginaActual - 1);
    }
  };

  const handleSubmitExamen = async () => {
    const tiempoEmpleado = 180;

    const respuestasCompletas = {};
    preguntas.forEach((pregunta) => {
      respuestasCompletas[pregunta.id] = respuestas[pregunta.id] || null;
    });

    const respuestasJSON = {
      respuestas: respuestasCompletas,
      tiempo_empleado: tiempoEmpleado,
    };

    try {
      await enviarRespuestas(examenId, respuestasJSON);
      navigate(`/examenes/${examenId}/resultado`);
    } catch (error) {
      console.error('Error al enviar las respuestas:', error);
    }
  };

  if (loading) {
    return <div>Cargando preguntas...</div>;
  }

  if (!preguntas || preguntas.length === 0) {
    return <div>No hay preguntas disponibles para este examen.</div>;
  }

  const indiceInicial = (paginaActual - 1) * preguntasPorPagina;
  const indiceFinal = indiceInicial + preguntasPorPagina;
  const preguntasPaginaActual = preguntas.slice(indiceInicial, indiceFinal);

  return (
    <div className="realizar-examen-container">
      <h2>Realizando Examen</h2>
      {preguntasPaginaActual.map((pregunta) => (
        <div key={pregunta.id} className="pregunta-card">
          <h3>{pregunta.texto}</h3>
          <ul className="opciones-list">
            {pregunta.opciones.map((opcion) => (
              <li key={opcion.id}>
                <label>
                  <input
                    type="radio"
                    name={`pregunta-${pregunta.id}`}
                    value={opcion.id}
                    checked={respuestas[pregunta.id] === opcion.id}
                    onChange={() => handleSelectRespuesta(pregunta.id, opcion.id)}
                  />
                  {opcion.texto}
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="navegacion-buttons">
        <button onClick={handlePreviousPage} disabled={paginaActual === 1}>
          Anterior
        </button>
        {paginaActual < totalPaginas ? (
          <button onClick={handleNextPage}>Siguiente</button>
        ) : (
          <button onClick={handleSubmitExamen}>Enviar Examen</button>
        )}
      </div>
    </div>
  );
};

export default RealizarExamen;
