/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { takeLatest, throttle } from 'redux-saga/effects';
import { INIT_SOCKET, INIT_GAME_CHANNEL, UPDATE_GAME, UPDATE_GAME_ADMIN, KICK_PLAYER } from '../constants/actionTypes';
import { initWebsocket, initGameChannel, updateGameSettings, updateGameSession, updateGameAdmin, removeGamePlayer } from './handlers/wsHandlers';

export default function* watchsocketSagas() {
  yield takeLatest(INIT_SOCKET, initWebsocket);
  yield takeLatest(INIT_GAME_CHANNEL, initGameChannel);

  // Update game settings instantantiously in store
  yield takeLatest(UPDATE_GAME, updateGameSettings);

  yield takeLatest(UPDATE_GAME_ADMIN, updateGameAdmin);
  yield takeLatest(KICK_PLAYER, removeGamePlayer);

  // Throttle websocket calls to update game server state
  // Take latest UPDATE_GAME action in every 500ms window
  yield throttle(500, UPDATE_GAME, updateGameSession);
}
