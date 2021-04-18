/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { takeLatest } from 'redux-saga/effects';
import { INIT_SOCKET, INIT_GAME_CHANNEL, UPDATE_GAME } from '../constants/actionTypes';
import { initWebsocket, initGameChannel, updateGameSession } from './handlers/wsHandlers';

export default function* watchsocketSagas() {
  yield takeLatest(INIT_SOCKET, initWebsocket);
  yield takeLatest(INIT_GAME_CHANNEL, initGameChannel);

  // Take at most one UPDATE_GAME action every 1000ms
  // throttle will ignore all UPDATE_GAME actions and take the trailing action if multiple UPDATE_GAME actions are fired within 1000ms
  yield takeLatest(UPDATE_GAME, updateGameSession);
}
