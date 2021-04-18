/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { takeLatest } from 'redux-saga/effects';
import { INIT_SOCKET, INIT_GAME_CHANNEL } from '../constants/actionTypes';
import { initWebsocket, initGameChannel } from './handlers/wsHandlers';

export default function* watchsocketSagas() {
  yield takeLatest(INIT_SOCKET, initWebsocket);
  yield takeLatest(INIT_GAME_CHANNEL, initGameChannel);
}
