/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Redirect, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Lobby from './pages/Lobby/Lobby';
import { SAVE_GAME_TO_JOIN_ID } from './constants/actionTypes';

export default ({ component: Component, type, ...rest }) => {
  const token = useSelector(state => state.userInfo.token);
  const dispatch = useDispatch();
  const { params: { game_id: gameToJoinId } } = useRouteMatch(`/${type}/:game_id`);

  if (gameToJoinId) dispatch({ type: SAVE_GAME_TO_JOIN_ID, payload: gameToJoinId });

  return (
    <Route
      {...rest}
      render={props => (token ? <Lobby {...props} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />)}
    />
  );
};
