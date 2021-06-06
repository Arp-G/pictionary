/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { call, put, select, take } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import createGameChannel from './gameChannel';
import createWebSocketConnection from '../websocket';
import {
  ADD_ALERT,
  SAVE_SOCKET_OBJECT,
  UPDATE_GAME_STATE,
  SAVE_GAME_CHANNEL,
  REMOVE_PLAYER,
  ADMIN_UPDATED,
  SAVE_GAME_TO_JOIN_ID
} from '../../constants/actionTypes';
import { WS_UPDATE_GAME, WS_UPDATE_ADMIN, WS_KICK_PLAYER } from '../../constants/websocketEvents';

// Initialize websocket and save socket object in store
export function* initWebsocket() {
  try {
    const token = yield select(state => state.userInfo.token);
    if (!token) throw new Error('Missing token');
    const socket = yield call(createWebSocketConnection, token);
    yield put({ type: SAVE_SOCKET_OBJECT, payload: socket });
  } catch (error) {
    console.log('Failed to establish websocket connection', error);
    yield put({ type: ADD_ALERT, alertType: 'error', msg: 'Failed to establish websocket connection' });
  }
}

// Initialize game channel and save channel object in store
// Then watch for events in game event channel and dispatch store actions on event channel updates
export function* initGameChannel(action, x) {
  const [token, gameId, socket] = yield select(state => [state.userInfo.token, state.game.id, state.settings.socket]);
  console.log(`Got a game id ${gameId} in store and action is `, action, x);

  if (!token || !gameId || !socket) {
    console.log('Could not initialize game channel');
    return;
  }

  const [gameChannel, sagaEventChannel] = yield call(createGameChannel, socket, gameId);

  yield put({ type: SAVE_GAME_CHANNEL, payload: gameChannel });

  try {
    while (true) {
      // Wait for and take emitted events from game channel
      // take(END) will terminate the watcher and go to finally block
      const { type, payload } = yield take(sagaEventChannel);

      console.log(`Received event on game channel ${type}`);

      // Dispatch event on store
      yield put({ type, payload });
    }
  } finally {
    console.log('END RECEIVED');
  }
}

// Update game settings in store
// HANDLE_UPDATE_GAME triggers both updateGameSession and updateGameSession
// updateGameSession -> Updates game state immediately in store
// updateGameSession -> Updates game state in server
export function* updateGameSettings(action) {
  yield put({ type: UPDATE_GAME_STATE, payload: action.payload });
}

// Update game settings in server by pushing messages on gamechannel websocket
export function* updateGameSession(action) {
  try {
    // eslint-disable-next-line camelcase
    const [gameChannel, gameId, creator_id] = yield select(state => [state.settings.gameChannel, state.game.id, state.game.creator_id]);
    if (!gameChannel) throw new Error('Game channel not initialized');
    gameChannel.push(WS_UPDATE_GAME, { ...action.payload, id: gameId, creator_id });
  } catch (error) {
    console.log('Failed to push updates to game data', error);
    yield put({ type: ADD_ALERT, alertType: 'error', msg: 'Failed to push updates to game data' });
  }
}

// Update game admin in server by pushing messages on gamechannel websocket
export function* updateGameAdmin(action) {
  try {
    // eslint-disable-next-line camelcase
    const gameChannel = yield select(state => state.settings.gameChannel);
    if (!gameChannel) throw new Error('Game channel not initialized');
    gameChannel.push(WS_UPDATE_ADMIN, { admin_id: action.payload });
  } catch (error) {
    console.log('Failed to push updates to game data', error);
    yield put({ type: ADD_ALERT, alertType: 'error', msg: 'Failed to push updates to game data' });
  }
}

// Kicks player from game by pushing messages on gamechannel websocket
export function* removeGamePlayer(action) {
  try {
    // eslint-disable-next-line camelcase
    const gameChannel = yield select(state => state.settings.gameChannel);
    if (!gameChannel) throw new Error('Game channel not initialized');
    gameChannel.push(WS_KICK_PLAYER, { player_id: action.payload });
  } catch (error) {
    console.log('Failed to push updates to game data', error);
    yield put({ type: ADD_ALERT, alertType: 'error', msg: 'Failed to push updates to game data' });
  }
}

// Handle player removed
export function* handlePlayerRemove(action) {
  const removedPlayerName = (yield select(state => state.game.players.find(player => player.id === action.payload)))?.name;
  yield put({ type: REMOVE_PLAYER, payload: action.payload });
  const selfRemoved = yield select(state => state.userInfo.id === action.payload);

  if (selfRemoved) {
    yield put({ type: SAVE_GAME_TO_JOIN_ID, payload: null });
    yield put(push('/'));
    yield put({ type: ADD_ALERT, alertType: 'info', msg: 'You have been removed from the game by admin!' });
  } else {
    yield put({ type: ADD_ALERT, alertType: 'info', msg: `${removedPlayerName} was removed from the game!` });
  }
}

// Handle admin updated
export function* handleAdminUpdated(action) {
  yield put({ type: ADMIN_UPDATED, payload: action.payload });
  const adminPlayerName = (yield select(state => state.game.players.find(player => player.id === action.payload)))?.name;
  yield put({ type: ADD_ALERT, alertType: 'info', msg: `${adminPlayerName} is now the admin!` });
}
