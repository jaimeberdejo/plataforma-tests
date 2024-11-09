// src/components/ExamenCard.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './ExamenCard.css';

const ExamenCard = ({ examen, handleDelete, openEditModal }) => {
  const { userRole } = useContext(AuthContext);

  return (
    <div className="examen-card">
      <h3>{examen.nombre}</h3>
      <p>{examen.descripcion}</p>
      <div className="actions">
        {userRole !== 'profesor' && (
          <Link to={`/examenes/${examen.id}/realizar`} className="btn">Realizar Examen</Link>
        )}
        <button onClick={openEditModal} className="btn">Editar Examen</button>
        <Link to={`/examenes/${examen.id}/preguntas`} className="btn">Editar Preguntas</Link>

        {userRole === 'profesor' && (
          <Link to={`/examenes/${examen.id}/estadisticas`} className="btn">Estadísticas</Link>
        )}
        <button onClick={() => handleDelete(examen.id)} className="btn delete-button">
          Eliminar Examen
        </button>
      </div>
    </div>
  );
};

export default ExamenCard;
