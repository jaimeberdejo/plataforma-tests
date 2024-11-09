// src/pages/ExamenList.js
import React, { useEffect, useState, useContext } from 'react';
import ExamenCard from '../components/ExamenCard';
import EditarExamen from './EditarExamen';
import CrearExamen from './CrearExamen';
import CrearExamenTxt from './CrearExamenTxt'; 
import { getExamenesByUser, deleteExamen } from '../services/examenService';
import { AuthContext } from '../context/AuthContext';
import './ExamenList.css';

const ExamenList = () => {
  const [examenes, setExamenes] = useState([]);
  const [isCrearExamenModalOpen, setIsCrearExamenModalOpen] = useState(false);
  const [isCrearExamenTxtModalOpen, setIsCrearExamenTxtModalOpen] = useState(false);
  const [isEditExamenModalOpen, setIsEditExamenModalOpen] = useState(false);
  const [selectedExamenId, setSelectedExamenId] = useState(null);

  const { userRole, userId } = useContext(AuthContext);

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

  useEffect(() => {
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

  const openCrearExamenModal = () => setIsCrearExamenModalOpen(true);
  const closeCrearExamenModal = () => setIsCrearExamenModalOpen(false);

  const openCrearExamenTxtModal = () => setIsCrearExamenTxtModalOpen(true);
  const closeCrearExamenTxtModal = () => setIsCrearExamenTxtModalOpen(false);

  const openEditExamenModal = (examenId) => {
    setSelectedExamenId(examenId);
    setIsEditExamenModalOpen(true);
  };

  const closeEditExamenModal = () => {
    setSelectedExamenId(null);
    setIsEditExamenModalOpen(false);
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
            openEditModal={() => openEditExamenModal(examen.id)} // Usa la función para abrir modal
          />
        ))
      ) : (
        <p>No se encontraron exámenes.</p>
      )}

      {userRole !== 'alumno' && (
        <div className="crear-examen-container">
          <button onClick={openCrearExamenModal} className="crear-examen-button">
            Crear Nuevo Examen
          </button>
          
            <button onClick={openCrearExamenTxtModal} className="crear-examen-txt-button">
              Crear Examen desde TXT
            </button>
          
        </div>
      )}

      {isCrearExamenModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-button" onClick={closeCrearExamenModal}>×</button>
            <CrearExamen closeModal={closeCrearExamenModal} refreshExamenes={fetchExamenes} />
          </div>
        </div>
      )}

      {isCrearExamenTxtModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-button" onClick={closeCrearExamenTxtModal}>×</button>
            <CrearExamenTxt closeModal={closeCrearExamenTxtModal} refreshExamenes={fetchExamenes} />
          </div>
        </div>
      )}

      {isEditExamenModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-button" onClick={closeEditExamenModal}>×</button>
            <EditarExamen examenId={selectedExamenId} closeModal={closeEditExamenModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamenList;
