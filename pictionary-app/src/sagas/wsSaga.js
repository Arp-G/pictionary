/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { takeLatest, throttle } from 'redux-saga/effects';
import { INIT_SOCKET, INIT_GAME_CHANNEL, UPDATE_GAME } from '../constants/actionTypes';
import { initWebsocket, initGameChannel, updateGameSettings, updateGameSession } from './handlers/wsHandlers';

export default function* watchsocketSagas() {
  yield takeLatest(INIT_SOCKET, initWebsocket);
  yield takeLatest(INIT_GAME_CHANNEL, initGameChannel);

  // Update game settings instantantiously in store
  yield takeLatest(UPDATE_GAME, updateGameSettings);

  // Throttle websocket calls to update game server state
  yield throttle(500, UPDATE_GAME, updateGameSession);
}
