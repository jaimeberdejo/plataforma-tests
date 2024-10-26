import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getResultado } from '../services/resultadoService'; // Asegúrate de tener este servicio implementado
import './Resultado.css';

const Resultado = () => {
  const { examenId } = useParams();
  const navigate = useNavigate();
  const [resultado, setResultado] = useState(null);
  const [mostrarSoloErroneas, setMostrarSoloErroneas] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResultado = async () => {
      try {
        const response = await getResultado(examenId); // Llamar al servicio para obtener los resultados
        const resultados = response.data;

        if (resultados && resultados.length > 0) {
          const ultimoResultado = resultados[resultados.length - 1];
          setResultado(ultimoResultado);  // Almacenar el último resultado
        } else {
          setError('No se encontraron resultados para este examen');
        }

        setLoading(false);
      } catch (err) {
        setError('Error al obtener los resultados del examen');
        setLoading(false);
      }
    };

    fetchResultado();
  }, [examenId]);

  if (loading) {
    return <div>Cargando resultados...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!resultado || !resultado.preguntas) {
    return <div>No se encontraron resultados para este examen.</div>;
  }

  const handleMostrarErroneas = () => {
    setMostrarSoloErroneas(true);
  };

  const handleMostrarTodas = () => {
    setMostrarSoloErroneas(false);
  };

  const handleRepetirExamen = () => {
    navigate(`/examenes/${examenId}/realizar`);
  };

  const preguntasFiltradas = mostrarSoloErroneas
    ? resultado.preguntas.filter(p => !p.correcta)
    : resultado.preguntas;

  return (
    <div className="resultado-container">
      <h2>Resultados del Examen</h2>
      {resultado ? (
        <>
          <p>Preguntas Correctas: {resultado.puntuacion} de {resultado.preguntas.length}</p>
          <p>Tiempo empleado: {resultado.tiempo_empleado}</p>

          <div className="opciones">
            <button onClick={handleMostrarTodas} className={!mostrarSoloErroneas ? 'active' : ''}>
              Ver todas las preguntas
            </button>
            <button onClick={handleMostrarErroneas} className={mostrarSoloErroneas ? 'active' : ''}>
              Ver solo preguntas erróneas
            </button>
          </div>

          <ul className="preguntas-list">
            {preguntasFiltradas.map((pregunta, index) => (
              <li key={index} className="pregunta-item">
                <h3>{pregunta.texto}</h3>
                <ul className="opciones-list">
                  {pregunta.opciones.map((opcion) => (
                    <li
                      key={opcion.id}
                      className={`opcion-item ${opcion.correcta ? 'correcta' : ''} ${
                        opcion.seleccionada && !opcion.correcta ? 'incorrecta' : ''
                      }`}
                    >
                      {opcion.texto}
                      {opcion.correcta && <span className="icono-correcto">✔</span>}
                      {opcion.seleccionada && !opcion.correcta && <span className="icono-incorrecto">✘</span>}
                    </li>
                  ))}
                </ul>
                {pregunta.explicacion && (
                  <p className="explicacion">
                    <strong>Explicación:</strong> {pregunta.explicacion}
                  </p>
                )}
              </li>
            ))}
          </ul>

          <div className="repetir-examen-container">
            <button onClick={handleRepetirExamen} className="repetir-button">
              Repetir Examen
            </button>
          </div>
        </>
      ) : (
        <p>No se encontró ningún resultado para este examen.</p>
      )}
    </div>
  );
};

export default Resultado;
