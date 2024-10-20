// src/pages/Home.js

import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="home-content">
        <h1>Bienvenido a la Plataforma de Exámenes</h1>
        <p>
          Esta aplicación te permite crear, realizar y gestionar exámenes tipo test de manera
          fácil e intuitiva. Crea tus propios exámenes, edita preguntas y revisa los resultados
          de manera rápida y organizada.
        </p>
        <Link to="/crear-examen" className="create-exam-button">
          Crear Examen
        </Link>
      </section>
    </div>
  );
};

export default Home;
