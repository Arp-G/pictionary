import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import userInfo from './userInfo';
import settings from './settings';
import game from './game';
import gamePlay from './gamePlay';

const createRootReducer = history => combineReducers({
  settings,
  userInfo,
  game,
  gamePlay,
  router: connectRouter(history)
});

export default createRootReducer;
