import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getResultadosByExamen } from '../services/examenService';
import { AuthContext } from '../context/AuthContext';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

import './Estadisticas.css';

// Registra componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Estadisticas = () => {
  const { examenId } = useParams();
  const navigate = useNavigate();
  const { userRole } = useContext(AuthContext);
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [averageScore, setAverageScore] = useState(0);
  const [averageTime, setAverageTime] = useState(0);
  const [preguntasStats, setPreguntasStats] = useState([]);
  const [orderByFailures, setOrderByFailures] = useState('asc');

  useEffect(() => {
    if (userRole !== 'profesor') {
      navigate('/');
      return;
    }

    const fetchResultados = async () => {
      try {
        const data = await getResultadosByExamen(examenId);
        setResultados(data);
        calculateMetrics(data);
        calculatePreguntaStats(data);
        setLoading(false);
      } catch (error) {
        setError('Error al cargar los resultados del examen.');
        setLoading(false);
      }
    };
    fetchResultados();
  }, [examenId, userRole, navigate]);

  const calculateMetrics = (data) => {
    if (data.length === 0) return;

    const totalScores = data.reduce((acc, item) => acc + item.puntuacion, 0);
    const totalTimes = data.reduce((acc, item) => acc + parseFloat(item.tiempo_empleado || 0), 0);

    setAverageScore((totalScores / data.length).toFixed(2));
    setAverageTime(((totalTimes / data.length) || 0).toFixed(2)); 
  };

  const calculatePreguntaStats = (data) => {
    const stats = {};

    data.forEach((resultado) => {
      resultado.preguntas.forEach((pregunta) => {
        if (!stats[pregunta.id]) {
          stats[pregunta.id] = {
            texto: pregunta.texto,
            aciertos: 0,
            fallos: 0,
          };
        }

        if (pregunta.correcta) {
          stats[pregunta.id].aciertos += 1;
        } else {
          stats[pregunta.id].fallos += 1;
        }
      });
    });

    const sortedStats = Object.keys(stats).map((key) => ({
      id: key,
      ...stats[key],
    }));

    setPreguntasStats(sortedStats);
  };

  const handleSort = (order) => {
    const sortedStats = [...preguntasStats].sort((a, b) => {
      if (order === 'asc') {
        return a.fallos - b.fallos;
      } else {
        return b.fallos - a.fallos;
      }
    });
    setOrderByFailures(order);
    setPreguntasStats(sortedStats);
  };

  const barData = {
    labels: resultados.map((res) => res.usuario.nombre),
    datasets: [
      {
        label: 'Puntuación por Usuario',
        data: resultados.map((res) => res.puntuacion),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const pieData = {
    labels: ['0-25%', '26-50%', '51-75%', '76-100%'],
    datasets: [
      {
        data: [
          resultados.filter((res) => res.puntuacion <= res.preguntas.length * 0.25).length,
          resultados.filter((res) => res.puntuacion > res.preguntas.length * 0.25 && res.puntuacion <= res.preguntas.length * 0.5).length,
          resultados.filter((res) => res.puntuacion > res.preguntas.length * 0.5 && res.puntuacion <= res.preguntas.length * 0.75).length,
          resultados.filter((res) => res.puntuacion > res.preguntas.length * 0.75).length,
        ],
        backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0'],
      },
    ],
  };

  if (loading) return <div>Cargando estadísticas...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="estadisticas-container">
      <h2>Estadísticas del Examen</h2>

      {/* Coloca la tabla primero */}
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
              <td>{`${resultado.puntuacion}/${resultado.preguntas.length}`}</td>
              <td>{parseFloat(resultado.tiempo_empleado).toFixed(2)} segundos</td>
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

      {/* Métricas y gráficos */}
      <div className="metrics">
        <p><strong>Promedio de Puntuación:</strong> {averageScore}</p>
        <p><strong>Tiempo Promedio de Realización:</strong> {averageTime} segundos</p>
        <p><strong>Total de Participantes:</strong> {resultados.length}</p>
      </div>

      <div className="charts">
        <div className="chart">
          <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
        <div className="chart">
          <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>

      {/* Estadísticas por pregunta */}
      <div className="preguntas-estadisticas-container">
        <h3>Estadísticas de Preguntas</h3>
        <div className="sort-buttons">
          <button onClick={() => handleSort('asc')} className={orderByFailures === 'asc' ? 'active' : ''}>
            Ordenar de menos fallos a más
          </button>
          <button onClick={() => handleSort('desc')} className={orderByFailures === 'desc' ? 'active' : ''}>
            Ordenar de más fallos a menos
          </button>
        </div>

        <table className="preguntas-stats-table">
          <thead>
            <tr>
              <th>Pregunta</th>
              <th>Aciertos</th>
              <th>Fallos</th>
            </tr>
          </thead>
          <tbody>
            {preguntasStats.map((pregunta, index) => (
              <tr key={index}>
                <td>{pregunta.texto}</td>
                <td>{pregunta.aciertos}</td>
                <td>{pregunta.fallos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Estadisticas;
