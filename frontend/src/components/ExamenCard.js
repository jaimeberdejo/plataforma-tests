// src/components/ExamenCard.js

import React from 'react';
import { Link } from 'react-router-dom';
import './ExamenCard.css';

const ExamenCard = ({ examen, handleDelete }) => {
  return (
    <div className="examen-card">
      <h3>{examen.nombre}</h3>
      <p>{examen.descripcion}</p>
      <div className="actions">
        <Link to={`/examenes/${examen.id}/realizar`} className="btn">Realizar Examen</Link>
        <Link to={`/examenes/${examen.id}/editar`} className="btn">Editar Examen</Link>
        <Link to={`/examenes/${examen.id}/preguntas`} className="btn">Editar Preguntas</Link>
        <button
          onClick={() => handleDelete(examen.id)}
          className="btn delete-button"
        >
          Eliminar Examen
        </button>
      </div>
    </div>
  );
};

export default ExamenCard;
