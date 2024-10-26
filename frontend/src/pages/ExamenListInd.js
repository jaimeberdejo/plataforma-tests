import React, { useEffect, useState, useContext } from 'react';
import ExamenCard from '../components/ExamenCard';
import { getExamenesByUser, deleteExamen } from '../services/examenService';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './ExamenList.css';

const ExamenList = () => {
  const [examenes, setExamenes] = useState([]);
  const { userRole, userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchExamenes = async () => {
      if (userId) {
        try {
          const data = await getExamenesByUser(userId);
          setExamenes(data);
        } catch (error) {
          console.error('Error al obtener los exámenes:', error);
        }
      }
    };
    fetchExamenes();
  }, [userId]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este examen?');
    if (confirmDelete) {
      try {
        await deleteExamen(id);
        setExamenes((prevExamenes) => prevExamenes.filter((examen) => examen.id !== id));
      } catch (error) {
        console.error('Error al eliminar el examen:', error);
      }
    }
  };

  return (
    <div className="examen-list">
      <h2>Lista de Exámenes</h2>
      {examenes.length > 0 ? (
        examenes.map((examen) => (
          <ExamenCard
            key={examen.id}
            examen={examen}
            handleDelete={userRole !== 'alumno' ? handleDelete : null}
          />
        ))
      ) : (
        <p>No se encontraron exámenes.</p>
      )}

      {/* Mostrar botones de creación de examen según el rol */}
      {userRole !== 'alumno' && (
        <div className="crear-examen-container">
          <Link to="/crear-examen" className="crear-examen-button">
            Crear Nuevo Examen
          </Link>
          {userRole === 'profesor' && (
            <Link to="/crear-examen-txt" className="crear-examen-txt-button">
              Crear Examen desde TXT
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamenList;
