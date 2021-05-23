/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { put, select } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { ADD_ALERT } from '../../constants/actionTypes';
import { WS_START_GAME, WS_CANVAS_UPDATE, WS_SEND_MESSAGE, WS_SELECT_WORD } from '../../constants/websocketEvents';

// Handle admin updated
export function* startGame(_action) {
  try {
    const gameChannel = yield select(state => state.settings.gameChannel);
    if (!gameChannel) throw new Error('Game channel not initialized');
    gameChannel.push(WS_START_GAME);
  } catch (error) {
    console.log('Failed to push updates to game data', error);
    yield put({ type: ADD_ALERT, alertType: 'error', msg: 'Failed to push updates to game data' });
  }
}

export function* handleGameStarted(_action) {
  const gameId = yield select(state => state.game.id);
  // TODO: update game state
  yield put(push(`/game/${gameId}`));
}

export function* updateCanvas(action) {
  try {
    const gameChannel = yield select(state => state.settings.gameChannel);
    if (!gameChannel) throw new Error('Game channel not initialized');
    gameChannel.push(WS_CANVAS_UPDATE, { canvas_data: action.payload });
    // yield put({ type: UPDATE_CANVAS, payload: action.payload });
  } catch (error) {
    console.log('Failed to push updates to game data', error);
    yield put({ type: ADD_ALERT, alertType: 'error', msg: 'Failed to push updates to game data' });
  }
}

export function* handleSendMessage(action) {
  try {
    const gameChannel = yield select(state => state.settings.gameChannel);
    if (!gameChannel) throw new Error('Game channel not initialized');
    gameChannel.push(WS_SEND_MESSAGE, { message: action.payload });
  } catch (error) {
    console.log('Failed to push updates to game data', error);
    yield put({ type: ADD_ALERT, alertType: 'error', msg: 'Failed to push updates to game data' });
  }
}

export function* handleWordSelected(action) {
  try {
    const gameChannel = yield select(state => state.settings.gameChannel);
    if (!gameChannel) throw new Error('Game channel not initialized');
    gameChannel.push(WS_SELECT_WORD, { word: action.payload });
  } catch (error) {
    console.log('Failed to push updates to game data', error);
    yield put({ type: ADD_ALERT, alertType: 'error', msg: 'Failed to push updates to game data' });
  }
}
