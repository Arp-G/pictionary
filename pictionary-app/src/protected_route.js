/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default ({ component: Component, ...rest }) => {
  const token = useSelector(state => state.userInfo.token);
  return (
    <Route
      {...rest}
      render={props => (token ? <Component {...props} /> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />)}
    />
  );
};
