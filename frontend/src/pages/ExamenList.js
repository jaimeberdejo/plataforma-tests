// src/pages/ExamenList.js

import React, { useEffect, useState } from 'react';
import ExamenCard from '../components/ExamenCard';
import { getExamenes, deleteExamen } from '../services/examenService'; // Asegúrate de importar deleteExamen
import { Link } from 'react-router-dom'; // Importa Link para la navegación
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
        await deleteExamen(id); // Llama al servicio para eliminar el examen
        setExamenes(examenes.filter((examen) => examen.id !== id)); // Actualiza el estado
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

      {/* Botón Crear Examen */}
      <div className="crear-examen-container">
        <Link to="/crear-examen" className="crear-examen-button">
          Crear Nuevo Examen
        </Link>
      </div>
    </div>
  );
};

export default ExamenList;
