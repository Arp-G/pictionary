/* eslint-disable import/prefer-default-export */
import { takeLatest } from 'redux-saga/effects';
import { CREATE_SESSION, RESTORE_SESSION, CREATE_GAME } from '../constants/actionTypes';
import { saveUserSession, loadUserSession, saveGameSession } from './handlers/handlers';

/*
  The watcher Saga is a generator thats runs in the background and
  listens for any actions dispatched on the store.
  It will map them to handler functions that make API requests and store data in redux store
*/
export function* watcherSaga() {
  yield takeLatest(CREATE_SESSION, saveUserSession);
  yield takeLatest(RESTORE_SESSION, loadUserSession);
  yield takeLatest(CREATE_GAME, saveGameSession);
}
