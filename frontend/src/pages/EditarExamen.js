import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getExamenById, updateExamen } from '../services/examenService';
import { getAlumnos } from '../services/alumnoService';
import { AuthContext } from '../context/AuthContext';
import './ExamenForm.css';

const EditarExamen = () => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [randomizarPreguntas, setRandomizarPreguntas] = useState(false);
  const [randomizarOpciones, setRandomizarOpciones] = useState(false);
  const [preguntasPorPagina, setPreguntasPorPagina] = useState('');
  const [numeroPreguntas, setNumeroPreguntas] = useState(10);
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosSeleccionados, setAlumnosSeleccionados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const { userId, userRole } = useContext(AuthContext);

  useEffect(() => {
    if (userRole !== 'profesor' && userRole !== 'independiente') {
      navigate('/'); // Redirige si el rol no es profesor o independiente
    } else {
      const fetchExamenData = async () => {
        try {
          const examen = await getExamenById(id);
          if (examen) {
            setNombre(examen.nombre || '');
            setDescripcion(examen.descripcion || '');
            setRandomizarPreguntas(examen.randomizar_preguntas || false);
            setRandomizarOpciones(examen.randomizar_opciones || false);
            setPreguntasPorPagina(examen.preguntas_por_pagina || 'todas');
            setNumeroPreguntas(examen.numero_preguntas || 10);
            setAlumnosSeleccionados(examen.alumnos_asignados || []);
          } else {
            console.error('Examen no encontrado');
          }

          if (userRole === 'profesor') {
            const alumnosData = await getAlumnos(userId);
            setAlumnos(alumnosData);
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Error al cargar el examen o los alumnos:", error);
          setIsLoading(false);
        }
      };

      fetchExamenData();
    }
  }, [id, userId, userRole, navigate]);

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
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="40">40</option>
            <option value="100000">Todas</option>
          </select>
        </div>

        {/* Selección de alumnos asignados, solo visible para profesores */}
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

        <button type="submit" className="submit-btn">Guardar Cambios</button>
      </form>
    </div>
  );
};

export default EditarExamen;
