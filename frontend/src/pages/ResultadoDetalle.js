// src/pages/ResultadoDetalle.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import './Resultado.css';

const ResultadoDetalle = () => {
  const location = useLocation();
  const { resultado } = location.state || {};

  if (!resultado) {
    return <div>No se encontró ningún resultado para este examen.</div>;
  }

  const preguntasErroneas = resultado.preguntas.filter((p) => !p.correcta);

  return (
    <div className="resultado-container">
      <h2>Detalles del Resultado</h2>
      <p>Usuario: {resultado.usuario.nombre}</p>
      <p>Preguntas Correctas: {resultado.puntuacion} de {resultado.preguntas.length}</p>
      <p>Tiempo empleado: {resultado.tiempo_empleado} segundos</p>

      <ul className="preguntas-list">
        {resultado.preguntas.map((pregunta, index) => (
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
    </div>
  );
};

export default ResultadoDetalle;
