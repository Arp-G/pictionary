/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Redirect, useRouteMatch } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { SAVE_GAME_TO_JOIN_ID } from './constants/actionTypes';

export default ({ component: Component, ...rest }) => {
  const token = useSelector(state => state.userInfo.token);
  const dispatch = useDispatch();
  const { params: { game_id: gameToJoinId } } = useRouteMatch('/lobby/:game_id');

  if (gameToJoinId) dispatch({ type: SAVE_GAME_TO_JOIN_ID, payload: gameToJoinId });

  return (
    <Route
      {...rest}
      render={props => (token ? <Component {...props} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />)}
    />
  );
};
