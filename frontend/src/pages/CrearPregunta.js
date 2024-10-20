import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createPregunta } from '../services/preguntaService';
import './PreguntaForm.css';

const CrearPregunta = () => {
  const { examenId } = useParams();
  const navigate = useNavigate();

  const [descripcion, setDescripcion] = useState('');
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

      // Si la opción eliminada era la respuesta correcta, reiniciar el campo de respuesta correcta
      if (opciones[index] === respuestaCorrecta) {
        setRespuestaCorrecta('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Mapeamos las opciones para que incluyan el campo "es_correcta"
    const opcionesData = opciones.map((texto) => ({
      texto,
      es_correcta: texto === respuestaCorrecta,  // Marcamos la opción correcta
    }));
  
    // Creamos los datos de la pregunta incluyendo las opciones y el examen
    const preguntaData = {
      texto: descripcion,  // Cambia 'descripcion' por 'texto' que es lo que tu modelo espera
      opciones: opcionesData,  // Las opciones anidadas
      examen: examenId,  // ID del examen al que pertenece la pregunta
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
              {/* Botón para eliminar la opción, solo si hay más de 2 opciones */}
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

        <button type="submit" className="submit-button">Crear Pregunta</button>
      </form>
    </div>
  );
};

export default CrearPregunta;
