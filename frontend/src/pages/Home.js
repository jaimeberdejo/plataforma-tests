import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, userRole } = useContext(AuthContext); // Obtén el rol del usuario

  return (
    <div className="home-container">
      <section className="home-content">
        {isAuthenticated ? (
          <>
            <h1>Bienvenido a la Plataforma de gestión de Exámenes</h1>
            <p>
              Esta aplicación te permite gestionar exámenes tipo test de manera
              fácil e intuitiva.
            </p>

            {userRole === 'profesor' && (
              <div className="profesor-actions">
                <Link to="/examenes" className="manage-exams-button">
                  Gestionar Exámenes
                </Link>
                <Link to="/alumnos" className="manage-students-button">
                  Gestionar Alumnos
                </Link>
              </div>
            )}

            {userRole === 'alumno' && (
              <div className="alumno-actions">
                <p>Como alumno, puedes realizar los exámenes asignados por tus profesores.</p>
                <Link to="/examenes-asignados" className="exam-list-button">
                  Ver Exámenes
                </Link>
              </div>
            )}

            {userRole === 'independiente' && (
              <div className="independiente-actions">
                <p>Como usuario independiente, puedes crear y realizar exámenes para uso personal.</p>
                <Link to="/crear-examen" className="create-exam-button">
                  Crear Examen
                </Link>
                <Link to="/examenes" className="exam-list-button">
                  Ver Mis Exámenes
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="auth-prompt">
            <h1>Bienvenido a la Plataforma de gestión de Exámenes</h1>
            <p>
              Inicia sesión o regístrate para acceder a las funcionalidades de la plataforma.
            </p>
            <div className="auth-buttons">
              <Link to="/login" className="auth-button">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="auth-button">
                Registrarse
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
