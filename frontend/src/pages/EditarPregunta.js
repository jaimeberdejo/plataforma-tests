import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPreguntaById, updatePregunta } from '../services/preguntaService';
import './PreguntaForm.css';

const EditarPregunta = () => {
  const { examenId, preguntaId } = useParams();  // Obtener los IDs del examen y la pregunta desde la URL
  const navigate = useNavigate();

  const [texto, setTexto] = useState('');  // Estado para el texto de la pregunta
  const [opciones, setOpciones] = useState([]);  // Estado para las opciones de respuesta
  const [respuestaCorrecta, setRespuestaCorrecta] = useState('');  // Estado para la opción correcta
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPregunta = async () => {
      try {
        const response = await getPreguntaById(preguntaId);  // Obtener la pregunta por su ID
        const pregunta = response.data;
        setTexto(pregunta.texto);
        setOpciones(pregunta.opciones);
        const correcta = pregunta.opciones.find(opcion => opcion.es_correcta);
        setRespuestaCorrecta(correcta ? correcta.texto : '');
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar la pregunta:', error);
        setLoading(false);
      }
    };

    fetchPregunta();
  }, [preguntaId]);

  const handleChangeOpcion = (index, value) => {
    const newOpciones = [...opciones];
    newOpciones[index].texto = value;
    setOpciones(newOpciones);
  };

  const addOpcion = () => {
    setOpciones([...opciones, { texto: '', es_correcta: false }]);  // Añadir nueva opción vacía
  };

  const removeOpcion = (index) => {
    if (opciones.length > 2) {  // Asegurarse de que siempre queden al menos 2 opciones
      const newOpciones = opciones.filter((_, i) => i !== index);
      setOpciones(newOpciones);

      // Si la opción eliminada era la respuesta correcta, reiniciar el campo de respuesta correcta
      if (opciones[index].texto === respuestaCorrecta) {
        setRespuestaCorrecta('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const opcionesData = opciones.map((opcion) => ({
      texto: opcion.texto,
      es_correcta: opcion.texto === respuestaCorrecta,  // Marcar la opción correcta
    }));

    const preguntaData = {
      texto,
      opciones: opcionesData,
      examen: examenId,  // Asegúrate de que el ID del examen se incluya correctamente
    };

    try {
      await updatePregunta(preguntaId, preguntaData);
      navigate(`/examenes/${examenId}/preguntas`);
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
              {/* Botón para eliminar opción si hay más de dos */}
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

        <button type="submit" className="submit-button">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditarPregunta;
