import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getExamenById, updateExamen } from '../services/examenService';
import './ExamenForm.css';

const EditarExamen = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [randomizarPreguntas, setRandomizarPreguntas] = useState(false);
  const [randomizarOpciones, setRandomizarOpciones] = useState(false);
  const [preguntasPorPagina, setPreguntasPorPagina] = useState('');
  const [numeroPreguntas, setNumeroPreguntas] = useState(10);  // Estado para el número de preguntas
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExamen = async () => {
      try {
        const examen = await getExamenById(id);
  
        if (examen) {
          setNombre(examen.nombre || '');
          setDescripcion(examen.descripcion || '');
          setRandomizarPreguntas(examen.randomizar_preguntas || false);
          setRandomizarOpciones(examen.randomizar_opciones || false);
          setPreguntasPorPagina(examen.preguntas_por_pagina || 'todas');
          setNumeroPreguntas(examen.numero_preguntas || 10);  // Establece el número de preguntas
        } else {
          console.error('Examen no encontrado');
        }
  
        setIsLoading(false);
      } catch (error) {
        console.error("Error al cargar el examen:", error);
        setIsLoading(false);
      }
    };
  
    fetchExamen();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const examenData = {
      nombre,
      descripcion,
      randomizar_preguntas: randomizarPreguntas,
      randomizar_opciones: randomizarOpciones,
      preguntas_por_pagina: preguntasPorPagina,
      numero_preguntas: numeroPreguntas,  // Incluir el número de preguntas en la actualización
    };

    try {
      await updateExamen(id, examenData);
      navigate('/examenes');
    } catch (error) {
      console.error('Error al actualizar el examen:', error);
    }
  };

  if (isLoading) {
    return <div>Cargando datos del examen...</div>;
  }

  return (
    <div className="examen-form-container">
      <h2>Editar Examen</h2>
      <form onSubmit={handleSubmit} className="examen-form">
        <div className="form-group">
          <label>Nombre del Examen</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Número de preguntas del examen</label>
          <input
            type="number"
            value={numeroPreguntas}
            onChange={(e) => setNumeroPreguntas(e.target.value)}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label>¿Randomizar el orden de las preguntas?</label>
          <input
            type="checkbox"
            checked={randomizarPreguntas}
            onChange={(e) => setRandomizarPreguntas(e.target.checked)}
          />
        </div>

        <div className="form-group">
          <label>¿Randomizar el orden de las Opciones?</label>
          <input
            type="checkbox"
            checked={randomizarOpciones}
            onChange={(e) => setRandomizarOpciones(e.target.checked)}
          />
        </div>

        <div className="form-group">
          <label>Número de preguntas por página</label>
          <select
            value={preguntasPorPagina}
            onChange={(e) => setPreguntasPorPagina(e.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="40">40</option>
            <option value="todas">100000</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditarExamen;
