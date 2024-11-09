import React, { useState, useEffect } from 'react';
import { getPreguntaById, updatePregunta } from '../services/preguntaService';
import './PreguntaForm.css';

const EditarPregunta = ({ pregunta, closeModal, refreshPreguntas }) => {
  const [texto, setTexto] = useState(pregunta?.texto || '');
  const [explicacion, setExplicacion] = useState(pregunta?.explicacion || '');
  const [opciones, setOpciones] = useState(pregunta?.opciones || []);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(
    pregunta?.opciones.find((opcion) => opcion.es_correcta)?.texto || ''
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPregunta = async () => {
      if (!pregunta) {
        setLoading(true);
        try {
          const response = await getPreguntaById(pregunta.id);
          const preguntaData = response.data;
          setTexto(preguntaData.texto);
          setExplicacion(preguntaData.explicacion || '');
          setOpciones(preguntaData.opciones);
          const correcta = preguntaData.opciones.find((opcion) => opcion.es_correcta);
          setRespuestaCorrecta(correcta ? correcta.texto : '');
        } catch (error) {
          console.error('Error al cargar la pregunta:', error);
        }
        setLoading(false);
      }
    };
    fetchPregunta();
  }, [pregunta]);

  const handleChangeOpcion = (index, value) => {
    const newOpciones = [...opciones];
    newOpciones[index].texto = value;
    setOpciones(newOpciones);
  };

  const addOpcion = () => {
    setOpciones([...opciones, { texto: '', es_correcta: false }]);
  };

  const removeOpcion = (index) => {
    if (opciones.length > 2) {
      const newOpciones = opciones.filter((_, i) => i !== index);
      setOpciones(newOpciones);
      if (opciones[index].texto === respuestaCorrecta) {
        setRespuestaCorrecta('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const opcionesData = opciones.map((opcion) => ({
      texto: opcion.texto,
      es_correcta: opcion.texto === respuestaCorrecta,
    }));
    const preguntaData = {
      texto,
      explicacion,
      opciones: opcionesData,
      examen: pregunta.examen,
    };

    try {
      await updatePregunta(pregunta.id, preguntaData);
      refreshPreguntas(); // Refresca la lista de preguntas en PreguntaList
      closeModal(); // Cierra el modal después de guardar
    } catch (error) {
      console.error('Error al actualizar la pregunta:', error);
    }
  };

  if (loading) {
    return <div>Cargando datos de la pregunta...</div>;
  }

  return (
    <div className="pregunta-form-container">
      <h2>Editar Pregunta</h2>
      <form onSubmit={handleSubmit} className="pregunta-form">
        <div className="form-group">
          <label>Descripción de la Pregunta</label>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Opciones de Respuesta</label>
          {opciones.map((opcion, index) => (
            <div key={index} className="opcion">
              <input
                type="text"
                value={opcion.texto}
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
              <option key={index} value={opcion.texto}>
                {opcion.texto}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Explicación (opcional)</label>
          <textarea
            value={explicacion}
            onChange={(e) => setExplicacion(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-button">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditarPregunta;
