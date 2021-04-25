/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { call, put, select, take } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { createUserSession, getUserData, createGame, getGame } from '../requests/requests';
import {
  SAVE_TOKEN,
  ADD_ALERT,
  LOAD_SESSION,
  SAVE_GAME,
  CREATE_GAME_SESSION,
  GET_GAME_DATA,
  SET_LOADING,
  CLEAR_LOADING,
  INIT_SOCKET,
  INIT_GAME_CHANNEL,
  CREATE_GAME_FLOW,
  JOIN_GAME_FLOW,
  CREATE_AND_ENTER_GAME_SESSION,
  JOIN_EXISTING_GAME_SESSION,
  GAME_JOIN_SUCCESS,
  GAME_JOIN_FAIL,
  REMOVE_PLAYER,
  ADMIN_UPDATED,
  SAVE_GAME_TO_JOIN_ID
} from '../../constants/actionTypes';

/*
  === Notes on various Redux SAGA effects ===

 * call executes a function(api call) will some arguments and blocks or suspends generator until function is done
 * put creates the dispatch Effect, its like dispatch({ type: SAVE_TOKEN, payload: token })
   (call and put are both blocking and generate is suspend until specified action is complete)

 * fork is like call but used to create a non-blocking call generator will not wait for forked action to complete
 * join instructs the middleware to wait for the result of a previously forked task.
 * spwan is like fork but cretes detached tasks
*/

// Create game flow: This SAGA fetches users token and saves in store
// it then triggers different flows to either create and join game or join an existing game
export function* saveUserSession(action) {
  try {
    yield put({ type: SET_LOADING });
    const response = yield call(createUserSession, action.payload); // This is always required to save the updated user avatar
    yield put({ type: SAVE_TOKEN, payload: response.data });
    window.localStorage.setItem('token', response.data.token);

    if (action.flowType === CREATE_GAME_FLOW) yield put({ type: CREATE_AND_ENTER_GAME_SESSION });
    if (action.flowType === JOIN_GAME_FLOW) yield put({ type: JOIN_EXISTING_GAME_SESSION, payload: action.gameToJoinId });
  } catch (error) {
    console.log(error);
    yield put({ type: ADD_ALERT, alertType: 'error', msg: 'Something went wrong when creating user session!' });
  }
}

// This saga will create a new game session and join game session
export function* creatAndEnterGameSession() {
  // Create game session
  yield put({ type: CREATE_GAME_SESSION });
  // Action CREATE_GAME_SESSION will execute further sagas and we want to navigate
  // to the lobby only after action SAVE_GAME is done and game data is loaded in store
  // the "take" effect waits for a certain action on the store
  const { payload } = yield take(SAVE_GAME);

  // Init Socket Connection
  yield put({ type: INIT_SOCKET });

  // Init Game channel
  yield put({ type: INIT_GAME_CHANNEL });

  // Navigate to lobby
  yield put(push(`lobby/${payload?.id}`));

  yield put({ type: CLEAR_LOADING });
}

// This saga will join an existing game session
export function* joinGameSession(action) {
  yield put({ type: GET_GAME_DATA, payload: action.payload });

  const { payload } = yield take(SAVE_GAME);

  // Init Socket Connection
  yield put({ type: INIT_SOCKET });

  // Init Game channel
  yield put({ type: INIT_GAME_CHANNEL, payload: payload?.id });

  // Wait for either game join success or failure
  const gameJoinResponse = yield take([GAME_JOIN_SUCCESS, GAME_JOIN_FAIL]);

  if (gameJoinResponse.payload) {
    yield put(push('/'));
    yield put({ type: ADD_ALERT, alertType: 'error', msg: `Could not join game: ${gameJoinResponse.payload}` });
  } else {
    yield put(push(`lobby/${payload?.id}`));
  }

  yield put({ type: CLEAR_LOADING });
}

// This saga requests for userData using token from server and if present it loads data in store
export function* loadUserSession() {
  try {
    const token = yield select(state => state.userInfo.token);
    if (!token) return;
    const response = yield call(getUserData);
    yield put({ type: LOAD_SESSION, payload: response.data });
  } catch (error) {
    window.localStorage.clear('token');
    console.log('Failed to fetch user data');
  }
}

// This saga will create a new game session by sending api request and save game data in store
export function* createGameSession() {
  try {
    const response = yield call(createGame);
    yield put({ type: SAVE_GAME, payload: response.data });
  } catch (error) {
    yield put({ type: ADD_ALERT, alertType: 'error', msg: 'Something went wrong when creating the game session!' });
    console.log('Failed to save game data');
  }
}

// This saga will fetch exisitng game data by sending api request and save game data in store
export function* getGameData(action) {
  try {
    const response = yield call(getGame, action.payload);
    yield put({ type: SAVE_GAME, payload: response.data });
  } catch (error) {
    yield put({ type: ADD_ALERT, alertType: 'error', msg: 'Something went wrong when fetching the game session!' });
    console.log('Failed to fetch game data');
  }
}

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

export function* handleAdminUpdated(action) {
  yield put({ type: ADMIN_UPDATED, payload: action.payload });
  const adminPlayerName = (yield select(state => state.game.players.find(player => player.id === action.payload)))?.name;
  yield put({ type: ADD_ALERT, alertType: 'info', msg: `${adminPlayerName} is now the admin!` });
}
