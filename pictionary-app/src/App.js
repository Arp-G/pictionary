import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ProtectedRoute from './protected_route';
import Home from './pages/Home/Home';
import Lobby from './pages/Lobby/Lobby';
import Layout from './layout/layout';
import './App.scss';

function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <ProtectedRoute exact path="/lobby" component={Lobby} />
        </Switch>
      </Layout>
    </Router>
  );
}

export default App;
