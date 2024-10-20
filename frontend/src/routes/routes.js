
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import ExamenList from '../FuturePages/ExamenList';
import ExamenForm from '../FuturePages/ExamenForm';
import PreguntaList from '../FuturePages/PreguntaList';
import RealizarExamen from '../FuturePages/RealizarExamen';
import CorreccionExamen from '../pages/CorreccionExamen';
import ResultadoList from '../FuturePages/ResultadoList';
import CorreccionList from '../pages/CorreccionList';

const Routes = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/examenes" component={ExamenList} />
        <Route path="/crear-examen" component={ExamenForm} />
        <Route path="/examenes/:id/editar" component={ExamenForm} />
        <Route path="/examenes/:id/preguntas" component={PreguntaList} />
        <Route path="/examenes/:id/realizar" component={RealizarExamen} />
        <Route path="/examenes/:id/correccion" component={CorreccionExamen} />
        <Route path="/resultados" component={ResultadoList} />
        <Route path="/resultados/:id/correcciones" component={CorreccionList} />
      </Switch>
    </Router>
  );
};

export default Routes;
