/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { eventChannel, END } from 'redux-saga';
import { call, put, select, take } from 'redux-saga/effects';
import { ADD_ERROR, GAME_SETTINGS_UPDATE } from '../../constants/actionTypes';
import createWebSocketConnection from '../websocket';

function createGameChannel(socket, gameId) {
  return eventChannel((emitter) => {
    console.log('Trying to initialize game channel');
    const gameChannel = socket.channel(`game:${gameId}`, {});
    gameChannel.join();
    gameChannel.on('ping', payload => emitter(payload));
    gameChannel.onError((e) => {
      console.log('An error occuered on game channel ', e);
      emitter({ tpye: ADD_ERROR });
    });
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

    // On unmount unsubscribe from channel and dissconnect from socket
    return () => {
      gameChannel.leave();
      socket.disconnect();
    };
  });
}

export default function* watchsocketSagas() {
  console.log('watchsocketSagas');
  const [token, gameId] = yield select(state => [state.userInfo.token, '5531298a-7058-45a8-96cf-88337e5f177c']);
  console.log('GOT token and gameid ', token, gameId);
  if (!token || !gameId) return watchsocketSagas();
  const socket = yield call(createWebSocketConnection, token);
  const gameChannel = yield call(createGameChannel, socket, gameId);

  try {
    while (true) {
      // Wait for and take emitted events from game channel
      console.log('Watching for events on game channel');
      // take(END) will terminate the watcher and go to finally block
      const payload = yield take(gameChannel);
      console.log('GOT UPDATE FROM GAME CHANNEL', payload);
      // yield put({ type: GAME_SETTINGS_UPDATE, payload });
    }
  } finally {
    console.log('END RECEIVED');
  }
}
