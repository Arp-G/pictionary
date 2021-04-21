/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { eventChannel, END } from 'redux-saga';
import { call, put, select, take } from 'redux-saga/effects';
import { Presence } from 'phoenix';
import { ADD_ALERT, SAVE_SOCKET_OBJECT, UPDATE_GAME_STATE, SAVE_GAME_CHANNEL } from '../../constants/actionTypes';
import createWebSocketConnection from '../websocket';

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
      console.log('Watching for events on game channel');

      // Wait for and take emitted events from game channel
      // take(END) will terminate the watcher and go to finally block
      const { type, payload } = yield take(sagaEventChannel);

      // Dispatch event on store
      yield put({ type, payload });
    }
  } finally {
    console.log('END RECEIVED');
  }
}

// Update game settings in store
export function* updateGameSettings(action) {
  try {
    yield put({ type: UPDATE_GAME_STATE, payload: action.payload });
  } catch (error) {
    console.log('Failed to update game data in store', error);
  }
}

// Update game settings in server by pushing messages on gamechannel webscoket
export function* updateGameSession(action) {
  try {
    // eslint-disable-next-line camelcase
    const [gameChannel, gameId, creator_id] = yield select(state => [state.settings.gameChannel, state.game.id, state.game.creator_id]);
    if (!gameChannel) throw new Error('Game channel not initialized');
    gameChannel.push('update_game', { ...action.payload, id: gameId, creator_id });
  } catch (error) {
    console.log('Failed to push updates to game data', error);
    yield put({ type: ADD_ALERT, alertType: 'error', msg: 'Failed to push updates to game data' });
  }
}

/*
  Here the event channels takes subscriber function that subscribes to an event source(subscribes to the game channel)
  Incoming events from the event source(messages from game channel) will be queued in the event
  channel until interested takers(while loop in initGameChannel) are registered.
  The subscriber function must return an unsubscribe function to terminate the subscription.
  (here we use this to unsubscribe from the game channel)
*/
function createGameChannel(socket, gameId) {
  const gameChannel = socket.channel(`game:${gameId}`, {});
  return [
    gameChannel,
    eventChannel((emitter) => {
      console.log('Trying to initialize game channel');

      const presence = new Presence(gameChannel);

      gameChannel.join()
        .receive('error', (resp) => {
          emitter({ type: ADD_ALERT, alertType: 'error', msg: 'Could not join game channel' });
          console.log('Unable to join', resp);
        });

      const test = (p) => {
        p.list((u_id, { metas: [first, ...rest] }) => {
          console.log(u_id, first, rest);
        });
      };

      presence.onSync(() => test(presence));

      // Register listeners different types of events this channel can receive
      gameChannel.on('game_settings_updated', payload => emitter({ type: UPDATE_GAME_STATE, payload }));

      gameChannel.onError((e) => {
        console.log('An error occuered on game channel ', e);
        emitter({ type: ADD_ALERT, alertType: 'error', msg: 'An error occuered on game channel' });
      });

      gameChannel.onClose((e) => {
        if (e.code === 1005) {
          console.log('WebSocket: closed');
          // Terminate watcher saga watcher saga by sending END
          emitter(END);
        } else {
          console.log('Socket is closed Unexpectedly', e);
          emitter({ type: ADD_ALERT, alertType: 'error', msg: 'Socket is closed Unexpectedly' });
          // TODO: Handle retry on socket disconnection(phoenix automatically does that)
          // setTimeout(() => {}, 4000);
        }
      });

      // On unmount unsubscribe from channel
      return () => {
        gameChannel.leave();
        // socket.disconnect();
      };
    })
  ];
}
