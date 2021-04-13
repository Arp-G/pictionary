import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import userInfo from '../reducers/userInfo';
import settings from '../reducers/settings';
import { watcherSaga } from '../sagas/rootSaga';

const devMode = process.env.NODE_ENV === 'development';

const rootReducer = combineReducers({ settings, userInfo });
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

if (devMode) middlewares.push(logger);

const configureStore = () => {
  const store = createStore(rootReducer, applyMiddleware(...middlewares));
  sagaMiddleware.run(watcherSaga);
  return store;
};

// The watcher saga watches for any dispatched actions
export default configureStore;
