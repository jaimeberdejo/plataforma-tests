import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPreguntasByExamen, deletePregunta } from '../services/preguntaService';
import { getExamenById } from '../services/examenService';
import CrearPregunta from './CrearPregunta';
import EditarPregunta from './EditarPregunta';
import './PreguntaList.css';

const PreguntaList = () => {
  const { examenId } = useParams();
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [examen, setExamen] = useState(null);
  const [colapsadas, setColapsadas] = useState({});
  const [isCrearPreguntaModalOpen, setIsCrearPreguntaModalOpen] = useState(false);
  const [isEditarPreguntaModalOpen, setIsEditarPreguntaModalOpen] = useState(false);
  const [selectedPregunta, setSelectedPregunta] = useState(null);


  const fetchPreguntas = async () => {
    try {
      const response = await getPreguntasByExamen(examenId);
      setPreguntas(response.data);
      setLoading(false);

      const examenData = await getExamenById(examenId);
      setExamen(examenData);

    } catch (error) {
      console.error('Error al obtener las preguntas:', error);
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchPreguntas();
  }, [examenId]);

  const handleDelete = async (preguntaId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta pregunta?')) {
      try {
        await deletePregunta(preguntaId);
        setPreguntas(preguntas.filter((pregunta) => pregunta.id !== preguntaId));
      } catch (error) {
        console.error('Error al eliminar la pregunta:', error);
      }
    }
  };

  const openCrearPreguntaModal = () => setIsCrearPreguntaModalOpen(true);
  const closeCrearPreguntaModal = () => setIsCrearPreguntaModalOpen(false);

  const openEditarPreguntaModal = (pregunta) => {
    setSelectedPregunta(pregunta);
    setIsEditarPreguntaModalOpen(true);
  };
  const closeEditarPreguntaModal = () => {
    setSelectedPregunta(null);
    setIsEditarPreguntaModalOpen(false);
  };

  const toggleColapsar = (preguntaId) => {
    setColapsadas((prevState) => ({
      ...prevState,
      [preguntaId]: !prevState[preguntaId]
    }));
  };

  if (loading) {
    return <div>Cargando preguntas...</div>;
  }

  return (
    <div className="pregunta-list-container">
      <h2>Preguntas de {examen ? examen.nombre : 'Desconocido'}</h2>
      <button onClick={openCrearPreguntaModal} className="create-button">
        Crear Nueva Pregunta
      </button>

      <ul>
        {preguntas.length === 0 ? (
          <p>No hay preguntas en este examen.</p>
        ) : (
          preguntas.map((pregunta) => (
            <li key={pregunta.id} className="pregunta-card">
              <div className="pregunta-header">
                <strong>{pregunta.texto}</strong>
                <div className="actions">
                  <button
                    onClick={() => openEditarPreguntaModal(pregunta)}
                    className="edit-button"
                  >
                    Editar
                  </button>
                  <button onClick={() => handleDelete(pregunta.id)} className="delete-button">
                    Eliminar
                  </button>
                </div>
              </div>

              <button
                onClick={() => toggleColapsar(pregunta.id)}
                className="toggle-button"
              >
                {colapsadas[pregunta.id] ? 'Ocultar Opciones' : 'Mostrar Opciones'}
              </button>

              {colapsadas[pregunta.id] && (
                <div>
                  <ul className="respuestas-list">
                    {pregunta.opciones.map((opcion, index) => (
                      <li key={index} className={opcion.es_correcta ? 'opcion-correcta' : ''}>
                        {String.fromCharCode(97 + index)}) {opcion.texto}
                        {opcion.es_correcta && <span className="icono-correcto"> ✔ Correcta</span>}
                      </li>
                    ))}
                  </ul>
                  {pregunta.explicacion && (
                    <p className="explicacion">
                      <strong>Explicación:</strong> {pregunta.explicacion}
                    </p>
                  )}
                </div>
              )}
            </li>
          ))
        )}
      </ul>

      {/* Modal Crear Pregunta */}
      {isCrearPreguntaModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-button" onClick={closeCrearPreguntaModal}>×</button>
            <CrearPregunta examenId={examenId} closeModal={closeCrearPreguntaModal} refreshPreguntas={fetchPreguntas} />
          </div>
        </div>
      )}

      {/* Modal Editar Pregunta */}
      {isEditarPreguntaModalOpen && selectedPregunta && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-modal-button" onClick={closeEditarPreguntaModal}>×</button>
            <EditarPregunta
              pregunta={selectedPregunta}
              closeModal={closeEditarPreguntaModal}
              refreshPreguntas={fetchPreguntas}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PreguntaList;
