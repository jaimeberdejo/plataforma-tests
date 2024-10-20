import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createExamen } from '../services/examenService';
import './ExamenForm.css';

const CrearExamen = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [dividirPorTemas, setDividirPorTemas] = useState(false);
  const [randomizarPreguntas, setRandomizarPreguntas] = useState(false);
  const [randomizarOpciones, setRandomizarOpciones] = useState(false);
  const [preguntasPorPagina, setPreguntasPorPagina] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const examenData = {
      nombre,
      descripcion,
      dividir_por_temas: dividirPorTemas,
      randomizar_preguntas: randomizarPreguntas,
      randomizar_opciones: randomizarOpciones,
      preguntas_por_pagina: preguntasPorPagina,
    };

    try {
      const examenCreado = await createExamen(examenData); // Crear el examen y obtener el examen creado
      navigate(`/examenes/${examenCreado.id}/preguntas`);  // Redirigir a la lista de preguntas del examen recién creado
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
            ¿Randomizar el orden de las preguntas?
            <input
              type="checkbox"
              checked={randomizarPreguntas}
              onChange={(e) => setRandomizarPreguntas(e.target.checked)}
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            ¿Randomizar el orden de las opciones?
            <input
              type="checkbox"
              checked={randomizarOpciones}
              onChange={(e) => setRandomizarOpciones(e.target.checked)}
            />
          </label>
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
