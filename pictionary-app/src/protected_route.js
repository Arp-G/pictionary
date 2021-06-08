/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Redirect, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { SAVE_GAME_TO_JOIN_ID } from './constants/actionTypes';

export default ({ component: Component, ...rest }) => {
  const [token, gameId] = useSelector(state => [state.userInfo.token, state.game.id]);
  const dispatch = useDispatch();
  const lobbyParams = useRouteMatch('/lobby/:game_id');
  const gameParams = useRouteMatch('/game/:game_id');
  const gameToJoinId = lobbyParams?.params?.game_id || gameParams?.params?.game_id;

  // This dispatch leads to a warning "Cannot update a component while rendering a different component"
  // We don't need to save the game to join id when entering a game from lobby, thus we are using "gameId" here
  if (!gameId && gameToJoinId) dispatch({ type: SAVE_GAME_TO_JOIN_ID, payload: gameToJoinId });

  return (
    <Route
      {...rest}
      render={props => (token ? <Component {...props} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />)}
    />
  );
};
