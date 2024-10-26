import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Importa el contexto de autenticación
import './ExamenCard.css';

const ExamenCard = ({ examen, handleDelete }) => {
  const { userRole } = useContext(AuthContext); // Obtén el rol del usuario

  return (
    <div className="examen-card">
      <h3>{examen.nombre}</h3>
      <p>{examen.descripcion}</p>
      <div className="actions">
        {/* Solo muestra el botón "Realizar Examen" si el rol no es de profesor */}
        {userRole !== 'profesor' && (
          <Link to={`/examenes/${examen.id}/realizar`} className="btn">Realizar Examen</Link>
        )}

        <Link to={`/examenes/${examen.id}/editar`} className="btn">Editar Examen</Link>
        <Link to={`/examenes/${examen.id}/preguntas`} className="btn">Editar Preguntas</Link>

        {/* Botón "Estadísticas" visible solo para profesores */}
        {userRole === 'profesor' && (
          <Link to={`/examenes/${examen.id}/estadisticas`} className="btn">Estadísticas</Link>
        )}

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
