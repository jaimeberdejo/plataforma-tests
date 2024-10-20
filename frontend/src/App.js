// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';  // Página de inicio
import ExamenList from './pages/ExamenList';  // Página de lista de exámenes
import CrearExamen from './pages/CrearExamen';  // Página para crear un examen
import EditarExamen from './pages/EditarExamen';  // Página para editar un examen
import PreguntaList from './pages/PreguntaList';  // Página para listar las preguntas
import CrearPregunta from './pages/CrearPregunta';  // Página para crear una nueva pregunta
import EditarPregunta from './pages/EditarPregunta';  // Página para editar una pregunta
import RealizarExamen from './pages/RealizarExamen';  // Página para realizar un examen
import Resultado from './pages/Resultado';  // Página para corregir un examen
import Header from './components/Header';  // Importa el encabezado
import './App.css';  // Importa los estilos

const App = () => {
  return (
    <Router>
      <div>
        <Header />  {/* El encabezado estará presente en todas las páginas */}
        <main>
          <Routes>
            <Route path="/" element={<Home />} />  {/* Página de inicio */}
            <Route path="/examenes" element={<ExamenList />} />  {/* Lista de exámenes */}
            <Route path="/crear-examen" element={<CrearExamen />} />  {/* Crear un nuevo examen */}
            <Route path="/examenes/:id/editar" element={<EditarExamen />} />  {/* Editar un examen */}
            <Route path="/examenes/:examenId/preguntas" element={<PreguntaList />} />  {/* Lista de preguntas de un examen */}
            <Route path="/examenes/:examenId/crear-pregunta" element={<CrearPregunta />} />  {/* Crear una nueva pregunta */}
            <Route path="/examenes/:examenId/editar-pregunta/:preguntaId" element={<EditarPregunta />} />  {/* Editar una pregunta */}
            <Route path="/examenes/:examenId/realizar" element={<RealizarExamen />} />  {/* Realizar un examen */}
            <Route path="/examenes/:examenId/resultado" element={<Resultado />} />  {/* Corrección de un examen */}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
