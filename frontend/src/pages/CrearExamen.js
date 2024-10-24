import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createExamen } from '../services/examenService';
import './ExamenForm.css';

const CrearExamen = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [randomizarPreguntas, setRandomizarPreguntas] = useState(false);
  const [randomizarOpciones, setRandomizarOpciones] = useState(false);
  const [preguntasPorPagina, setPreguntasPorPagina] = useState('');
  const [numeroPreguntas, setNumeroPreguntas] = useState(10);  // Nuevo estado para el número de preguntas
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const examenData = {
      nombre,
      descripcion,
      randomizar_preguntas: randomizarPreguntas,
      randomizar_opciones: randomizarOpciones,
      preguntas_por_pagina: preguntasPorPagina,
      numero_preguntas: numeroPreguntas,  // Incluir el número de preguntas en el objeto de datos
    };

    try {
      const examenCreado = await createExamen(examenData);
      navigate(`/examenes/${examenCreado.id}/preguntas`);
    } catch (error) {
      console.error('Error al crear el examen:', error);
    }
  };

  return (
    <div className="examen-form-container">
      <h2>Crear Examen</h2>
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
          <label>¿Randomizar el orden de las opciones?</label>
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
            <option value="" disabled>Selecciona un número</option>  
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="40">40</option>
            <option value="100000">Todas</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">Crear Examen</button>
      </form>
    </div>
  );
};

export default CrearExamen;
