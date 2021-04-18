/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { eventChannel, END } from 'redux-saga';
import { call, put, select, take } from 'redux-saga/effects';
import { ADD_ERROR, SAVE_SOCKET_OBJECT } from '../../constants/actionTypes';
import createWebSocketConnection from '../websocket';

export function* initWebsocket() {
  try {
    const token = yield select(state => state.userInfo.token);
    if (!token) throw new Error('Missing token');
    const socket = yield call(createWebSocketConnection, token);
    yield put({ type: SAVE_SOCKET_OBJECT, payload: socket });
  } catch (error) {
    console.log('Failed to establish websocket connection', error);
  }
}

export function* initGameChannel() {
  const [token, gameId, socket] = yield select(state => [state.userInfo.token, state.game.id, state.settings.socket]);
  console.log('init game channel with ', [token, gameId, socket]);

  if (!token || !gameId || !socket) return;

  const gameChannel = yield call(createGameChannel, socket, gameId);

  try {
    while (true) {
      console.log('Watching for events on game channel');

      // Wait for and take emitted events from game channel
      // take(END) will terminate the watcher and go to finally block
      const { type, payload } = yield take(gameChannel);

      // Dispatch event on store
      yield put({ type, payload });
    }
  } finally {
    console.log('END RECEIVED');
  }
}

function createGameChannel(socket, gameId) {
  /*
    Here the event channels takes subscriber function that subscribes to an event source
    Incoming events from the event source will be queued in the channel until interested takers are registered.
    The subscriber function must return an unsubscribe function to terminate the subscription, here we use it to
    unsubscribe from the websocket channel
  */
  return eventChannel((emitter) => {
    console.log('Trying to initialize game channel');

    const gameChannel = socket.channel(`game:${gameId}`, {});

    gameChannel.join();

    // Register listeners different types of events this channel can receive
    gameChannel.on('ping', payload => emitter({ type: 'PING', payload }));

    gameChannel.onError((e) => {
      console.log('An error occuered on game channel ', e);
      emitter({ type: ADD_ERROR });
    });

    // TODO: Handle retry on socket disconnection(phoenix automatically does that)
    gameChannel.onClose((e) => {
      if (e.code === 1005) {
        console.log('WebSocket: closed');
        // Terminate watcher saga watcher saga by sending END
        emitter(END);
      } else {
        console.log('Socket is closed Unexpectedly. Reconnect will be attempted in 4 second.', e);
        // setTimeout(() => {}, 4000);
      }
    });

    // On unmount unsubscribe from channel
    return () => {
      gameChannel.leave();
      // socket.disconnect();
    };
  });
}
