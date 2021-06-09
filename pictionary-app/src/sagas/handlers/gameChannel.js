/* eslint-disable camelcase */
/* eslint-disable no-console */
import { eventChannel, END } from 'redux-saga';
import { select } from 'redux-saga/effects';
import { Presence } from 'phoenix';
import {
  ADD_ALERT,
  UPDATE_GAME_STATE,
  UPDATE_GAME_PLAYERS,
  ADD_MESSAGE,
  HANDLE_GAME_JOIN_SUCCESS,
  HANDLE_GAME_JOIN_FAIL,
  HANDLE_PLAYER_KICKED,
  HANDLE_ADMIN_UPDATED,
  HANDLE_GAME_STARTED,
  UPDATE_ROUND,
  UPDATE_SELECTED_WORD,
  UPDATE_SCORE,
  UPDATE_DRAWER,
  SET_GAME_OVER,
  SET_GAMEPLAY_STATE,
  CLEAR_SOCKET
} from '../../constants/actionTypes';

import {
  WS_PLAYER_REMOVED,
  WS_GAME_ADMIN_UPDATED,
  WS_GAME_SETTINGS_UPDATED,
  WS_GAME_STARTED,
  WS_NEW_MESSAGE,
  WS_NEW_ROUND,
  WS_SELECTED_WORD,
  WS_NEW_DRAWER_WORDS,
  WS_SCORE_UPDATE,
  WS_GAME_OVER
} from '../../constants/websocketEvents';
import newDrawerSfx from '../../sounds/new_drawer.mp3';

const setupGameChannelEventHandlers = (gameChannel, emitter) => {
  // Register listeners different types of events this channel can receive
  gameChannel.on(WS_GAME_SETTINGS_UPDATED, payload => emitter({ type: UPDATE_GAME_STATE, payload }));

  gameChannel.on(WS_PLAYER_REMOVED, ({ player_id }) => emitter({ type: HANDLE_PLAYER_KICKED, payload: player_id }));

  gameChannel.on(WS_GAME_ADMIN_UPDATED, ({ creator_id }) => emitter({ type: HANDLE_ADMIN_UPDATED, payload: creator_id }));

  gameChannel.on(WS_GAME_STARTED, () => emitter({ type: HANDLE_GAME_STARTED }));

  gameChannel.on(WS_NEW_MESSAGE, message => emitter({ type: ADD_MESSAGE, payload: message }));

  gameChannel.on(WS_NEW_ROUND, payload => emitter({ type: UPDATE_ROUND, payload: payload.data }));

  gameChannel.on(WS_SELECTED_WORD, (payload) => {
    emitter({ type: UPDATE_SELECTED_WORD, payload: payload.data });
    // BUG: This sound happens event if sound is disabled, need to fix this
    const soundEnabled = select(state => state.settings.sound);

    // Play the new drawer sfx, its difficult to use the audio audio hook here
    if (soundEnabled) new Audio(newDrawerSfx).play();
  });

  gameChannel.on(WS_NEW_DRAWER_WORDS, payload => emitter({ type: UPDATE_DRAWER, payload }));

  gameChannel.on(WS_SCORE_UPDATE, payload => emitter({ type: UPDATE_SCORE, payload: payload.data }));

  // TODO: No handlers yet need to show winners list, clear socket and have button or on timeout navigate to home page
  gameChannel.on(WS_GAME_OVER, payload => emitter({ type: SET_GAME_OVER, payload: payload.data }));
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
      gameChannel.join()
        .receive('ok', (payload) => {
          if (Object.keys(payload).length !== 0) emitter({ type: SET_GAMEPLAY_STATE, payload });
          emitter({ type: HANDLE_GAME_JOIN_SUCCESS });
        })
        .receive('error', resp => emitter({ type: HANDLE_GAME_JOIN_FAIL, payload: resp.reason }))
        .receive('timeout', () => emitter({ type: HANDLE_GAME_JOIN_FAIL, payload: 'Could not join game in time' }));

      setupGameChannelPresenceHandlers(gameChannel, emitter);
      setupGameChannelEventHandlers(gameChannel, emitter);

      gameChannel.onError((e) => {
        console.log('An error occured on game channel ', e);

        // This will prevent react unmounted component state update issue and prevent memory leaks
        emitter({ type: CLEAR_SOCKET });
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
