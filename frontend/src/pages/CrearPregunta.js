import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPregunta } from '../services/preguntaService';
import './PreguntaForm.css';

const CrearPregunta = () => {
  const { examenId } = useParams();
  const navigate = useNavigate();

  const [descripcion, setDescripcion] = useState('');
  const [explicacion, setExplicacion] = useState(''); // Nuevo campo de explicación
  const [opciones, setOpciones] = useState(['', '']);  // Al menos dos opciones por defecto
  const [respuestaCorrecta, setRespuestaCorrecta] = useState('');

  const handleChangeOpcion = (index, value) => {
    const newOpciones = [...opciones];
    newOpciones[index] = value;
    setOpciones(newOpciones);
  };

  const addOpcion = () => {
    setOpciones([...opciones, '']);
  };

  const removeOpcion = (index) => {
    if (opciones.length > 2) {
      const newOpciones = opciones.filter((_, i) => i !== index);
      setOpciones(newOpciones);

      if (opciones[index] === respuestaCorrecta) {
        setRespuestaCorrecta('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const opcionesData = opciones.map((texto) => ({
      texto,
      es_correcta: texto === respuestaCorrecta,
    }));
  
    const preguntaData = {
      texto: descripcion,
      opciones: opcionesData,
      examen: examenId,
      explicacion: explicacion, 
    };
  
    try {
      await createPregunta(preguntaData);
      navigate(`/examenes/${examenId}/preguntas`);
    } catch (error) {
      console.error('Error al crear la pregunta:', error);
    }
  };

  return (
    <div className="pregunta-form-container">
      <h2>Crear Nueva Pregunta</h2>
      <form onSubmit={handleSubmit} className="pregunta-form">
        <div className="form-group">
          <label>Descripción de la Pregunta</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Opciones de Respuesta</label>
          {opciones.map((opcion, index) => (
            <div key={index} className="opcion">
              <input
                type="text"
                value={opcion}
                onChange={(e) => handleChangeOpcion(index, e.target.value)}
                required
              />
              {opciones.length > 2 && (
                <button
                  type="button"
                  className="remove-opcion-button"
                  onClick={() => removeOpcion(index)}
                >
                  Eliminar
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addOpcion} className="add-opcion-button">
            Añadir Opción
          </button>
        </div>

        <div className="form-group">
          <label>Respuesta Correcta</label>
          <select
            value={respuestaCorrecta}
            onChange={(e) => setRespuestaCorrecta(e.target.value)}
            required
          >
            <option value="">Seleccione una opción</option>
            {opciones.map((opcion, index) => (
              <option key={index} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        </div>


        <div className="form-group">
          <label>Explicación (opcional)</label>
          <textarea
            value={explicacion}
            onChange={(e) => setExplicacion(e.target.value)} // Campo de texto para explicación
          />
        </div>

        <button type="submit" className="submit-button">Crear Pregunta</button>
      </form>
    </div>
  );
};

export default CrearPregunta;
