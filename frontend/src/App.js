import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';  // Importa el AuthProvider
import Home from './pages/Home';
import ExamenList from './pages/ExamenList';
import ExamenListAlumnos from './pages/ExamenListAlumnos';
import CrearExamen from './pages/CrearExamen';
import CrearExamenTxt from './pages/CrearExamenTxt';
import EditarExamen from './pages/EditarExamen';
import PreguntaList from './pages/PreguntaList';
import CrearPregunta from './pages/CrearPregunta';
import EditarPregunta from './pages/EditarPregunta';
import RealizarExamen from './pages/RealizarExamen';
import Resultado from './pages/Resultado';
import Header from './components/Header';
import Login from './pages/login';
import Register from './pages/Register';
import Alumnos from './pages/Alumnos';
import Estadisticas from './pages/Estadisticas';
import ResultadoDetalle from './pages/ResultadoDetalle';


import './App.css';

const App = () => {
  return (
    <AuthProvider>  
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/examenes" element={<ExamenList />} />
            <Route path="/examenes-asignados" element={<ExamenListAlumnos />} />
            <Route path="/crear-examen" element={<CrearExamen />} />
            <Route path="/crear-examen-txt" element={<CrearExamenTxt />} />
            <Route path="/examenes/:id/editar" element={<EditarExamen />} />
            <Route path="/examenes/:examenId/preguntas" element={<PreguntaList />} />
            <Route path="/examenes/:examenId/crear-pregunta" element={<CrearPregunta />} />
            <Route path="/examenes/:examenId/editar-pregunta/:preguntaId" element={<EditarPregunta />} />
            <Route path="/examenes/:examenId/realizar" element={<RealizarExamen />} />
            <Route path="/examenes/:examenId/resultado" element={<Resultado />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />     
            <Route path="/alumnos" element={<Alumnos />} />  
            <Route path="/examenes/:examenId/estadisticas" element={<Estadisticas />} />  
            <Route path="/resultados-detalle" element={<ResultadoDetalle />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
};

export default App;
