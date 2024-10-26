import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPreguntasByExamen, enviarRespuestas, getExamenById } from '../services/examenService';
import { AuthContext } from '../context/AuthContext';
import './RealizarExamen.css';

const RealizarExamen = () => {
  const { examenId } = useParams();
  const navigate = useNavigate();
  const { userId, userRole } = useContext(AuthContext); // Obtener ID y rol del usuario desde el contexto

  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [preguntasPorPagina, setPreguntasPorPagina] = useState(1);
  const [paginaActual, setPaginaActual] = useState(1);
  const [loading, setLoading] = useState(true);
  const [randomizarPreguntas, setRandomizarPreguntas] = useState(false);
  const [randomizarOpciones, setRandomizarOpciones] = useState(false);
  const [numeroPreguntas, setNumeroPreguntas] = useState(10);
  const [tiempoEmpleado, setTiempoEmpleado] = useState(0);

  useEffect(() => {
    const fetchExamenData = async () => {
      try {
        const examenData = await getExamenById(examenId);
        if (examenData) {
          setPreguntasPorPagina(examenData.preguntas_por_pagina || 1);
          setRandomizarPreguntas(examenData.randomizar_preguntas || false);
          setRandomizarOpciones(examenData.randomizar_opciones || false);
          setNumeroPreguntas(examenData.numero_preguntas || 10);
        }

        const response = await getPreguntasByExamen(examenId);
        let preguntasObtenidas = response;

        if (preguntasObtenidas.length > 0) {
          if (randomizarPreguntas) {
            preguntasObtenidas = mezclarArray(preguntasObtenidas);
          }

          if (randomizarOpciones) {
            preguntasObtenidas = preguntasObtenidas.map((pregunta) => ({
              ...pregunta,
              opciones: pregunta.opciones ? mezclarArray(pregunta.opciones) : [],
            }));
          }

          setPreguntas(preguntasObtenidas.slice(0, numeroPreguntas));
        } else {
          setPreguntas([]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos del examen o las preguntas:', error);
        setLoading(false);
      }
    };

    fetchExamenData();
  }, [examenId, randomizarPreguntas, randomizarOpciones, numeroPreguntas]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoEmpleado((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mezclarArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const totalPaginas = Math.ceil(preguntas.length / preguntasPorPagina);

  const handleSelectRespuesta = (preguntaId, opcionId) => {
    setRespuestas((prevRespuestas) => ({
      ...prevRespuestas,
      [preguntaId]: opcionId,
    }));
  };

  const handleNextPage = () => {
    if (paginaActual < totalPaginas) {
      setPaginaActual((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (paginaActual > 1) {
      setPaginaActual((prev) => prev - 1);
    }
  };

  const handleSubmitExamen = async () => {
    const respuestasCompletas = {};
    preguntas.forEach((pregunta) => {
      respuestasCompletas[pregunta.id] = respuestas[pregunta.id] || null;
    });

    const respuestasJSON = {
      examen: examenId,
      usuario_id:  userId, 
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
      <p>Tiempo empleado: {Math.floor(tiempoEmpleado / 60)}:{(tiempoEmpleado % 60).toString().padStart(2, '0')}</p>

      {preguntasPaginaActual.map((pregunta) => (
        <div key={pregunta.id} className="pregunta-card">
          <h3>{pregunta.texto}</h3>
          <ul className="opciones-list">
            {pregunta.opciones?.map((opcion) => (
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

