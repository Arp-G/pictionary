/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { takeLatest, throttle } from 'redux-saga/effects';
import {
  HANDLE_INIT_SOCKET,
  HANDLE_INIT_GAME_CHANNEL,
  HANDLE_UPDATE_GAME,
  HANDLE_UPDATE_ADMIN,
  HANDLE_KICK_PLAYER,
  HANDLE_PLAYER_KICKED,
  HANDLE_ADMIN_UPDATED
} from '../constants/actionTypes';
import {
  initWebsocket,
  initGameChannel,
  updateGameSettings,
  updateGameSession,
  updateGameAdmin,
  removeGamePlayer,
  handlePlayerRemove,
  handleAdminUpdated
} from './handlers/lobbyHandlers';

export default function* watchsocketSagas() {
  yield takeLatest(HANDLE_INIT_SOCKET, initWebsocket);
  yield takeLatest(HANDLE_INIT_GAME_CHANNEL, initGameChannel);

  // Update game settings instantaniously in store
  yield takeLatest(HANDLE_UPDATE_GAME, updateGameSettings);

  // HANDLE_UPDATE_GAME is also caught by below yield
  // Throttle websocket calls to update game settings in server
  // Take latest HANDLE_UPDATE_GAME action in every 500ms window
  yield throttle(500, HANDLE_UPDATE_GAME, updateGameSession);

  yield takeLatest(HANDLE_UPDATE_ADMIN, updateGameAdmin);
  yield takeLatest(HANDLE_ADMIN_UPDATED, handleAdminUpdated);

  yield takeLatest(HANDLE_KICK_PLAYER, removeGamePlayer);
  yield takeLatest(HANDLE_PLAYER_KICKED, handlePlayerRemove);
}
