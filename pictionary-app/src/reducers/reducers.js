import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import userInfo from './userInfo';
import settings from './settings';
import game from './game';

const createRootReducer = history => combineReducers({
  settings,
  userInfo,
  game,
  router: connectRouter(history)
});

export default createRootReducer;
