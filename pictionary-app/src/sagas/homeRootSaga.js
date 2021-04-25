/* eslint-disable import/prefer-default-export */
import { takeLatest } from 'redux-saga/effects';
import {
  HANDLE_CREATE_USER_SESSION,
  HANDLE_RESTORE_SESSION,
  HANDLE_CREATE_GAME_SESSION,
  HANDLE_CREATE_AND_ENTER_GAME_SESSION,
  HANDLE_JOIN_EXISTING_GAME_SESSION,
  HANDLE_GET_GAME_DATA
} from '../constants/actionTypes';
import {
  saveUserSession,
  loadUserSession,
  createGameSession,
  creatAndEnterGameSession,
  joinGameSession,
  getGameData
} from './handlers/homeHandlers';

/*
  The watcher Saga is a generator thats runs in the background and
  listens for any actions dispatched on the store.
  It will map them to handler functions that make API requests and store data in redux store
*/
export function* watcherSaga() {
  // Sagas to send api request and save to store
  yield takeLatest(HANDLE_CREATE_USER_SESSION, saveUserSession);
  yield takeLatest(HANDLE_CREATE_GAME_SESSION, createGameSession);
  yield takeLatest(HANDLE_GET_GAME_DATA, getGameData);

  // Sagas for flow
  yield takeLatest(HANDLE_CREATE_AND_ENTER_GAME_SESSION, creatAndEnterGameSession);
  yield takeLatest(HANDLE_JOIN_EXISTING_GAME_SESSION, joinGameSession);

  // Sagas for other stuff
  yield takeLatest(HANDLE_RESTORE_SESSION, loadUserSession);
}
