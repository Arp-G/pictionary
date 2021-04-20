/* eslint-disable import/prefer-default-export */
import { takeLatest } from 'redux-saga/effects';
import {
  CREATE_USER_SESSION,
  RESTORE_SESSION,
  CREATE_GAME_SESSION,
  CREATE_AND_ENTER_GAME_SESSION,
  JOIN_EXISTING_GAME_SESSION,
  GET_GAME_DATA
} from '../constants/actionTypes';
import {
  saveUserSession,
  loadUserSession,
  createGameSession,
  creatAndEnterGameSession,
  joinGameSession,
  getGameData
} from './handlers/handlers';

/*
  The watcher Saga is a generator thats runs in the background and
  listens for any actions dispatched on the store.
  It will map them to handler functions that make API requests and store data in redux store
*/
export function* watcherSaga() {
  // Sagas to send api request and save to store
  yield takeLatest(CREATE_USER_SESSION, saveUserSession);
  yield takeLatest(CREATE_GAME_SESSION, createGameSession);
  yield takeLatest(GET_GAME_DATA, getGameData);

  // Sagas for flow
  yield takeLatest(CREATE_AND_ENTER_GAME_SESSION, creatAndEnterGameSession);
  yield takeLatest(JOIN_EXISTING_GAME_SESSION, joinGameSession);

  // Sagas for other stuff
  yield takeLatest(RESTORE_SESSION, loadUserSession);
}
