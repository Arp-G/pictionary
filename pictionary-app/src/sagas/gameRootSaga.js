/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { takeLatest } from 'redux-saga/effects';
import {
  HANDLE_START_GAME,
  HANDLE_GAME_STARTED,
  HANDLE_CANVAS_UPDATE,
  HANDLE_CANVAS_UPDATED,
  HANDLE_SEND_MESSAGE,
  HANDLE_NEW_MESSAGE
} from '../constants/actionTypes';
import { startGame, handleGameStarted, handleCanvasUpdated, updateCanvas, handleNewMessage, handleSendMessage } from './handlers/gameHandlers';

export default function* watchsocketSagas() {
  yield takeLatest(HANDLE_START_GAME, startGame);
  yield takeLatest(HANDLE_GAME_STARTED, handleGameStarted);
  yield takeLatest(HANDLE_CANVAS_UPDATE, updateCanvas);
  yield takeLatest(HANDLE_CANVAS_UPDATED, handleCanvasUpdated);
  yield takeLatest(HANDLE_SEND_MESSAGE, handleSendMessage);
  yield takeLatest(HANDLE_NEW_MESSAGE, handleNewMessage);
}
