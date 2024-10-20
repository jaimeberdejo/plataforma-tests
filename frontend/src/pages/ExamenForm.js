import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getExamenById, createExamen, updateExamen } from '../services/examenService';
import './ExamenForm.css';

const ExamenForm = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [dividirPorTemas, setDividirPorTemas] = useState(false);
  const [randomizarPreguntas, setRandomizarPreguntas] = useState(false);
  const [randomizarRespuestas, setRandomizarRespuestas] = useState(false);
  const [preguntasPorPagina, setPreguntasPorPagina] = useState('todas');
  const { id } = useParams();
  const navigate = useNavigate();

  
  useEffect(() => {
    if (id) {
      // Si existe un ID, obtenemos los datos del examen para precargar el formulario
      const fetchExamen = async () => {
        const examen = await getExamenById(id);
        if (examen) {
          setNombre(examen.nombre);
          setDescripcion(examen.descripcion);
          setDividirPorTemas(examen.dividir_por_temas);
          setRandomizarPreguntas(examen.randomizar_preguntas);
          setRandomizarRespuestas(examen.randomizar_respuestas);
          setPreguntasPorPagina(examen.preguntas_por_pagina);
        }
      };
      fetchExamen();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const examenData = {
      nombre,
      descripcion,
      dividir_por_temas: dividirPorTemas,
      randomizar_preguntas: randomizarPreguntas,
      randomizar_respuestas: randomizarRespuestas,
      preguntas_por_pagina: preguntasPorPagina,
    };
    try {
      if (id) {
        // Si hay un ID, actualizamos el examen existente
        await updateExamen(id, examenData);
      } else {
        // Si no hay un ID, creamos un nuevo examen
        await createExamen(examenData);
      }
      navigate('/examenes');
    } catch (error) {
      console.error('Error al crear o editar el examen:', error);
    }
  };

  return (
    <div className="examen-form-container">
      <h2>{id ? 'Editar Examen' : 'Crear Examen'}</h2>
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
          <label>
            ¿Dividir examen por temas?
            <input
              type="checkbox"
              checked={dividirPorTemas}
              onChange={(e) => setDividirPorTemas(e.target.checked)}
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            ¿Randomizar preguntas?
            <input
              type="checkbox"
              checked={randomizarPreguntas}
              onChange={(e) => setRandomizarPreguntas(e.target.checked)}
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            ¿Randomizar respuestas?
            <input
              type="checkbox"
              checked={randomizarRespuestas}
              onChange={(e) => setRandomizarRespuestas(e.target.checked)}
            />
          </label>
        </div>

        <div className="form-group">
          <label>Número de preguntas por página</label>
          <select
            value={preguntasPorPagina}
            onChange={(e) => setPreguntasPorPagina(e.target.value)}
          >
            <option value="1">1</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="40">40</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">
          {id ? 'Guardar Cambios' : 'Crear Examen'}
        </button>
      </form>
    </div>
  );
};

export default ExamenForm;
