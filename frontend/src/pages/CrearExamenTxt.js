import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadTxtExamen } from '../services/examenService';  // Servicio para cargar archivo
import './CrearExamenTxt.css';

const CrearExamenTxt = () => {
  const [archivo, setArchivo] = useState(null);  // Estado para almacenar el archivo seleccionado
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setArchivo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!archivo) {
      alert('Por favor, selecciona un archivo .txt');
      return;
    }

    const formData = new FormData();
    formData.append('archivo_txt', archivo);  // Adjunta el archivo al FormData

    try {
      await uploadTxtExamen(formData);  // Llamada al servicio que maneja la carga del archivo
      navigate('/examenes');  // Redirige a la lista de exámenes tras la creación
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
    }
  };

  return (
    <div className="examen-form-container">
      <h2>Crear Examen desde un archivo .txt</h2>
      <form onSubmit={handleSubmit} className="examen-form">
        <div className="form-group">
          <label>Seleccionar Archivo .txt</label>
          <input type="file" accept=".txt" onChange={handleFileChange} required />
        </div>
        <button type="submit" className="submit-btn">Crear Examen</button>
      </form>

      <div className="ejemplo-formato">
        <h3>Formato del archivo .txt:</h3>
        <pre>
          Nombre del examen: Ejemplo de Examen{"\n"}
          Descripción: Este es un ejemplo básico{"\n\n"}
          Pregunta: ¿Cuál es la capital de Francia?{"\n"}
          a) Berlín{"\n"}
          b) Madrid{"\n"}
          c) París *{"\n"} 
          d) Roma{"\n"}
          Explicación: París es la capital de Francia.{"\n\n"}
          Pregunta: ¿Cuántos continentes hay en el mundo?{"\n"}
          a) 4{"\n"}
          b) 5{"\n"}
          c) 6 *{"\n"} 
          Explicación: Hay 7 continentes en el mundo.{"\n\n"}
          Pregunta: ¿Cuál es el planeta más grande del sistema solar?{"\n"}
          a) Marte{"\n"}
          b) Júpiter *{"\n"}
          c) Saturno{"\n"}
          d) Neptuno{"\n"}
          e) Tierra{"\n"}
        </pre>
        <p>El asterisco (*) debe estar junto a la opción correcta. La "Explicación" es opcional y puede incluirse después de cada pregunta.</p>
      </div>
    </div>
  );
};

export default CrearExamenTxt;

