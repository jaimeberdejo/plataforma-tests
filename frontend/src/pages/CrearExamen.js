// src/pages/CrearExamen.js
import React, { useState, useContext, useEffect } from 'react';
import { createExamen } from '../services/examenService';
import { getAlumnos } from '../services/alumnoService';
import { AuthContext } from '../context/AuthContext';
import './ExamenForm.css';

const CrearExamen = ({ closeModal, refreshExamenes }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [randomizarPreguntas, setRandomizarPreguntas] = useState(false);
  const [randomizarOpciones, setRandomizarOpciones] = useState(false);
  const [preguntasPorPagina, setPreguntasPorPagina] = useState('');
  const [numeroPreguntas, setNumeroPreguntas] = useState(10);
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosSeleccionados, setAlumnosSeleccionados] = useState([]);
  const { userId, userRole } = useContext(AuthContext);

  useEffect(() => {
    if (userRole === 'profesor') {
      const fetchAlumnos = async () => {
        try {
          const alumnosData = await getAlumnos(userId);
          setAlumnos(alumnosData);
        } catch (error) {
          console.error('Error al obtener la lista de alumnos:', error);
        }
      };
      fetchAlumnos();
    }
  }, [userId, userRole]);

  const handleAlumnoChange = (alumnoId) => {
    setAlumnosSeleccionados((prev) =>
      prev.includes(alumnoId) ? prev.filter((id) => id !== alumnoId) : [...prev, alumnoId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const examenData = {
      nombre,
      descripcion,
      randomizar_preguntas: randomizarPreguntas,
      randomizar_opciones: randomizarOpciones,
      preguntas_por_pagina: preguntasPorPagina,
      numero_preguntas: numeroPreguntas,
      creado_por: userId,
      alumnos_asignados: userRole === 'profesor' ? alumnosSeleccionados : [],
    };

    try {
      await createExamen(examenData);
      closeModal(); // Cierra el modal después de la creación
      refreshExamenes(); // Refresca la lista de exámenes
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
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
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
          <select value={preguntasPorPagina} onChange={(e) => setPreguntasPorPagina(e.target.value)}>
            <option value="" disabled>
              Selecciona un número
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="40">40</option>
            <option value="100000">Todas</option>
          </select>
        </div>
        {userRole === 'profesor' && (
          <div className="form-group">
            <label>Asignar Alumnos</label>
            <div className="alumnos-list">
              {alumnos.map((alumno) => (
                <div key={alumno.id} className="alumno-item">
                  <input
                    type="checkbox"
                    id={`alumno-${alumno.id}`}
                    checked={alumnosSeleccionados.includes(alumno.id)}
                    onChange={() => handleAlumnoChange(alumno.id)}
                  />
                  <label htmlFor={`alumno-${alumno.id}`}>{alumno.username}</label>
                </div>
              ))}
            </div>
          </div>
        )}
        <button type="submit" className="submit-btn">Crear Examen</button>
      </form>
    </div>
  );
};

export default CrearExamen;
