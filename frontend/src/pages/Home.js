import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { AuthContext } from '../context/AuthContext';  // Ahora esta ruta debería funcionar

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);  // Accede al estado de autenticación

  return (
    <div className="home-container">
      <section className="home-content">
        {isAuthenticated ? (
          <>
            <h1>Bienvenido a la Plataforma de Exámenes</h1>
            <p>
              Esta aplicación te permite crear, realizar y gestionar exámenes tipo test de manera
              fácil e intuitiva. Crea tus propios exámenes, edita preguntas y revisa los resultados
              de manera rápida y organizada.
            </p>
            <Link to="/crear-examen" className="create-exam-button">
              Crear Examen
            </Link>
          </>
        ) : (
          <>
            <h1>Bienvenido a la Plataforma de Exámenes</h1>
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
          </>
        )}
      </section>
    </div>
  );
};

export default Home;

