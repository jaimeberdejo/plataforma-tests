import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getResultadosByExamen } from '../services/examenService';
import { AuthContext } from '../context/AuthContext';
import './Estadisticas.css';

const Estadisticas = () => {
  const { examenId } = useParams();
  const navigate = useNavigate();
  const { userRole } = useContext(AuthContext);
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (userRole !== 'profesor') {
      navigate('/');
      return;
    }

    const fetchResultados = async () => {
      try {
        const data = await getResultadosByExamen(examenId);
        setResultados(data);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los resultados del examen.');
        setLoading(false);
      }
    };
    fetchResultados();
  }, [examenId, userRole, navigate]);

  if (loading) return <div>Cargando estadísticas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="estadisticas-container">
      <h2>Estadísticas del Examen</h2>
      <table className="resultados-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Preguntas Correctas</th>
            <th>Tiempo de Realización</th>
            <th>Fecha</th>
            <th>Ver Detalles</th>
          </tr>
        </thead>
        <tbody>
          {resultados.map((resultado, index) => (
            <tr key={index}>
              <td>{resultado.usuario.nombre}</td>
              <td>{`${resultado.puntuacion}/${resultado.preguntas.length}`}</td> {/* Total de preguntas visibles */}
              <td>{resultado.tiempo_empleado}</td>
              <td>{new Date(resultado.fecha_realizacion).toLocaleString()}</td>
              <td>
                <Link
                  to={{
                    pathname: `/resultados-detalle`,
                  }}
                  state={{ resultado }}
                  className="btn detalle-btn"
                >
                  Ver Resultado
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Estadisticas;
