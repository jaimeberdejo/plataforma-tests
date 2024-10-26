import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getExamenesAsignados } from '../services/examenService'; // Asegúrate de crear esta función en el servicio
import { Link } from 'react-router-dom';
import './ExamenListAlumnos.css';

const ExamenListAlumnos = () => {
  const [examenesAsignados, setExamenesAsignados] = useState([]);
  const { userId } = useContext(AuthContext); // Obtener el ID del usuario (alumno) del contexto

  useEffect(() => {
    // Función para obtener los exámenes asignados al alumno
    const fetchExamenesAsignados = async () => {
      try {
        const data = await getExamenesAsignados(userId); // Llama a la función para obtener exámenes asignados
        setExamenesAsignados(data);
      } catch (error) {
        console.error('Error al obtener los exámenes asignados:', error);
      }
    };
    fetchExamenesAsignados();
  }, [userId]);

  return (
    <div className="examen-list-alumnos-container">
      <h2>Exámenes Asignados</h2>
      {examenesAsignados.length > 0 ? (
        <ul>
          {examenesAsignados.map((examen) => (
            <li key={examen.id} className="examen-item">
              <div className="examen-info">
                <h3>{examen.nombre}</h3>
                <p>{examen.descripcion}</p>
              </div>
              <Link to={`/examenes/${examen.id}/realizar`} className="realizar-examen-button">
                Realizar Examen
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes exámenes asignados.</p>
      )}
    </div>
  );
};

export default ExamenListAlumnos;
