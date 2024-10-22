import React, { useEffect, useState } from 'react';
import ExamenCard from '../components/ExamenCard';
import { getExamenes, deleteExamen } from '../services/examenService'; 
import { Link } from 'react-router-dom'; 
import './ExamenList.css';

const ExamenList = () => {
  const [examenes, setExamenes] = useState([]);

  useEffect(() => {
    const fetchExamenes = async () => {
      const data = await getExamenes();
      setExamenes(data);
    };
    fetchExamenes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este examen?')) {
      try {
        await deleteExamen(id);
        setExamenes(examenes.filter((examen) => examen.id !== id)); 
      } catch (error) {
        console.error('Error al eliminar el examen:', error);
      }
    }
  };

  return (
    <div className="examen-list">
      <h2>Lista de Exámenes</h2>
      {examenes.map((examen) => (
        <ExamenCard key={examen.id} examen={examen} handleDelete={handleDelete} />
      ))}

      {/* Contenedor para ambos botones */}
      <div className="crear-examen-container">
        <Link to="/crear-examen" className="crear-examen-button">
          Crear Nuevo Examen
        </Link>
        <Link to="/crear-examen-txt" className="crear-examen-txt-button">
          Crear Examen desde TXT
        </Link>
      </div>
    </div>
  );
};

export default ExamenList;
