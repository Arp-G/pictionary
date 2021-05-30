import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import ProtectedRoute from './protected_route';
import { HANDLE_RESTORE_SESSION } from './constants/actionTypes';
import Home from './pages/Home/Home';
import Lobby from './pages/Lobby/Lobby';
import Game from './pages/Game/Game';
import NotFound from './pages/NotFound/NotFound';
import Layout from './layout/layout';
import './App.scss';

function App() {
  const dispatch = useDispatch();

  // Load user data if token in present
  useEffect(() => dispatch({ type: HANDLE_RESTORE_SESSION }), []);

  return (
    <Layout>
      <Switch>
        <Route exact path="/" component={Home} />
        <ProtectedRoute exact path="/lobby/:game_id" component={Lobby} />
        <ProtectedRoute exact path="/game/:game_id" component={Game} />
        <Route path="*" exact={true} component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default App;
