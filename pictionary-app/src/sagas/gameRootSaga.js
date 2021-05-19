/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { takeLatest, throttle } from 'redux-saga/effects';
import {
  HANDLE_START_GAME,
  HANDLE_GAME_STARTED,
  HANDLE_CANVAS_UPDATE,
  HANDLE_SEND_MESSAGE,
  HANDLE_UPDATE_SELECTED_WORD
} from '../constants/actionTypes';
import {
  startGame,
  handleGameStarted,
  updateCanvas,
  handleSendMessage,
  handleWordSelected
} from './handlers/gameHandlers';

export default function* watchsocketSagas() {
  yield takeLatest(HANDLE_START_GAME, startGame);
  yield takeLatest(HANDLE_GAME_STARTED, handleGameStarted);
  yield throttle(10, HANDLE_CANVAS_UPDATE, updateCanvas);
  yield takeLatest(HANDLE_SEND_MESSAGE, handleSendMessage);
  yield takeLatest(HANDLE_UPDATE_SELECTED_WORD, handleWordSelected);
}
