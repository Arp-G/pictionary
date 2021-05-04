/* eslint-disable camelcase */
/* eslint-disable no-console */
import { eventChannel, END } from 'redux-saga';
import { Presence } from 'phoenix';
import {
  ADD_ALERT,
  UPDATE_GAME_STATE,
  UPDATE_GAME_PLAYERS,
  HANDLE_GAME_JOIN_SUCCESS,
  HANDLE_GAME_JOIN_FAIL,
  HANDLE_PLAYER_KICKED,
  HANDLE_ADMIN_UPDATED,
  HANDLE_GAME_STARTED,
  HANDLE_CANVAS_UPDATED,
  HANDLE_NEW_MESSAGE
} from '../../constants/actionTypes';

import {
  WS_PLAYER_REMOVED,
  WS_GAME_ADMIN_UPDATED,
  WS_GAME_SETTINGS_UPDATED,
  WS_GAME_STARTED,
  WS_CANVAS_UPDATED,
  WS_NEW_MESSAGE
} from '../../constants/websocketEvents';

const setupGameChannelEventHandlers = (gameChannel, emitter) => {
  // Register listeners different types of events this channel can receive
  gameChannel.on(WS_GAME_SETTINGS_UPDATED, payload => emitter({ type: UPDATE_GAME_STATE, payload }));

  gameChannel.on(WS_PLAYER_REMOVED, ({ player_id }) => emitter({ type: HANDLE_PLAYER_KICKED, payload: player_id }));

  gameChannel.on(WS_GAME_ADMIN_UPDATED, ({ creator_id }) => emitter({ type: HANDLE_ADMIN_UPDATED, payload: creator_id }));

  gameChannel.on(WS_GAME_STARTED, () => emitter({ type: HANDLE_GAME_STARTED }));

  gameChannel.on(WS_CANVAS_UPDATED, ({ canvas_data }) => emitter({ type: HANDLE_CANVAS_UPDATED, payload: canvas_data }));

  gameChannel.on(WS_NEW_MESSAGE, message => emitter({ type: HANDLE_NEW_MESSAGE, payload: message }));
};

const setupGameChannelPresenceHandlers = (gameChannel, emitter) => {
  const presence = new Presence(gameChannel);
  presence.onSync(() => {
    // This callback passed to presence.list is called for each users presence, if 2 users it called twice
    // For each call the callback recieves how many times that user has connected to the socket
    const updatedPlayerList = [];
    // eslint-disable-next-line no-unused-vars
    presence.list((_userId, { metas: [firstPlayerInstance, ...rest] }) => {
      updatedPlayerList.push(firstPlayerInstance);
    });

    emitter({ type: UPDATE_GAME_PLAYERS, payload: updatedPlayerList.map(player => player.user_data) });
  });
};

/*
  Here the event channels takes subscriber function that subscribes to an event source(subscribes to the game channel)
  Incoming events from the event source(messages from game channel) will be queued in the event
  channel until interested takers(while loop in initGameChannel) are registered.
  The subscriber function must return an unsubscribe function to terminate the subscription.
  (here we use this to unsubscribe from the game channel)
*/
export default (socket, gameId) => {
  const gameChannel = socket.channel(`game:${gameId}`, {});
  return [
    gameChannel,
    eventChannel((emitter) => {
      console.log('Trying to initialize game channel');
      gameChannel.join()
        .receive('ok', () => emitter({ type: HANDLE_GAME_JOIN_SUCCESS }))
        .receive('error', resp => emitter({ type: HANDLE_GAME_JOIN_FAIL, payload: resp.reason }))
        .receive('timeout', () => emitter({ type: HANDLE_GAME_JOIN_FAIL, payload: 'Could not join game in time' }));

      setupGameChannelPresenceHandlers(gameChannel, emitter);
      setupGameChannelEventHandlers(gameChannel, emitter);

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
        }
      });

      // On unmount unsubscribe from channel
      return () => {
        gameChannel.leave();
        // socket.disconnect();
      };
    })
  ];
};
