/* eslint-disable import/prefer-default-export */
import { takeLatest } from 'redux-saga/effects';
import { CREATE_SESSION, RESTORE_SESSION, CREATE_GAME, UPDATE_GAME } from '../constants/actionTypes';
import { saveUserSession, loadUserSession, saveGameSession, updateGameSession } from './handlers/handlers';

/*
  The watcher Saga is a generator thats runs in the background and
  listens for any actions dispatched on the store.
  It will map them to handler functions that make API requests and store data in redux store
*/
export function* watcherSaga() {
  yield takeLatest(CREATE_SESSION, saveUserSession);
  yield takeLatest(RESTORE_SESSION, loadUserSession);
  yield takeLatest(CREATE_GAME, saveGameSession);

  // Take at most one UPDATE_GAME action every 1000ms
  // throttle will ignore all UPDATE_GAME actions and take the trailing action if multiple UPDATE_GAME actions are fired within 1000ms
  yield takeLatest(UPDATE_GAME, updateGameSession);
}
