import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { watcherSaga } from '../sagas/rootSaga';
import watcherWebsocketSaga from '../sagas/handlers/wsHandlers';
import createRootReducer from '../reducers/reducers';

export const history = createBrowserHistory();

const devMode = process.env.NODE_ENV === 'development';
const sagaMiddleware = createSagaMiddleware();
const wsMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware, wsMiddleware, routerMiddleware(history)];

if (devMode) middlewares.push(logger);

// compose: https://stackoverflow.com/questions/41357897/understanding-compose-functions-in-redux
export default () => {
  const store = createStore(createRootReducer(history), compose(applyMiddleware(...middlewares)));
  sagaMiddleware.run(watcherSaga);
  wsMiddleware.run(watcherWebsocketSaga);
  return store;
};
