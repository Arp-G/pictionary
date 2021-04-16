import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import userInfo from './userInfo';
import settings from './settings';

const createRootReducer = history => combineReducers({
  settings,
  userInfo,
  router: connectRouter(history)
});

export default createRootReducer;
