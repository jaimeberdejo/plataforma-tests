import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAlumnos, addAlumno, deleteAlumno } from '../services/alumnoService'; // Importa deleteAlumno
import './Alumnos.css';

const Alumnos = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [nuevoAlumno, setNuevoAlumno] = useState('');
  const [mensaje, setMensaje] = useState(''); // Estado para el mensaje
  const { userRole, userId } = useContext(AuthContext);

  // Obtener la lista de alumnos del profesor al cargar el componente
  useEffect(() => {
    const fetchAlumnos = async () => {
      if (userRole === 'profesor') {
        try {
          const alumnosData = await getAlumnos(userId);
          setAlumnos(alumnosData);
        } catch (error) {
          console.error('Error al obtener la lista de alumnos:', error);
        }
      }
    };
    fetchAlumnos();
  }, [userRole, userId]);

  // Manejar la adición de un nuevo alumno
  const handleAddAlumno = async () => {
    if (nuevoAlumno.trim()) {
      // Verificar si el alumno ya está en la lista
      const alumnoExistente = alumnos.some((alumno) => alumno.username === nuevoAlumno.trim());
      
      if (alumnoExistente) {
        setMensaje('Este alumno ya está asignado');
        return;
      }

      try {
        const alumnoAgregado = await addAlumno(userId, nuevoAlumno.trim());
        setAlumnos([...alumnos, alumnoAgregado]);
        setNuevoAlumno('');
        setMensaje('Alumno añadido exitosamente');
      } catch (error) {
        setMensaje(error.response?.data?.error || 'Error al agregar el alumno');
      }
    }
  };

  // Manejar la eliminación de un alumno
  const handleDeleteAlumno = async (alumnoId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este alumno?')) {
      try {
        await deleteAlumno(userId, alumnoId);
        setAlumnos(alumnos.filter((alumno) => alumno.id !== alumnoId));
        setMensaje('Alumno eliminado exitosamente');
      } catch (error) {
        console.error('Error al eliminar el alumno:', error);
        setMensaje('Error al eliminar el alumno');
      }
    }
  };

  return (
    <div className="alumnos-container">
      <h2>Lista de Alumnos</h2>
      {mensaje && <p className="mensaje">{mensaje}</p>}
      <ul>
        {alumnos.map((alumno) => (
          <li key={alumno.id}>
            {alumno.username}
            <button onClick={() => handleDeleteAlumno(alumno.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
      <div className="add-alumno-form">
        <input
          type="text"
          placeholder="Nombre de usuario del alumno"
          value={nuevoAlumno}
          onChange={(e) => setNuevoAlumno(e.target.value)}
        />
        <button onClick={handleAddAlumno}>Añadir Alumno</button>
      </div>
    </div>
  );
};

export default Alumnos;
