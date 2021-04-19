/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { call, put, select, take } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { createUserSession, getUserData, createGame } from '../requests/requests';
import {
  SAVE_TOKEN,
  ADD_ALERT,
  LOAD_SESSION,
  SAVE_GAME,
  CREATE_GAME,
  SET_LOADING,
  CLEAR_LOADING,
  INIT_SOCKET,
  INIT_GAME_CHANNEL
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

// This SAGA fetches users token and saves in store
export function* saveUserSession(action) {
  try {
    yield put({ type: SET_LOADING });
    const response = yield call(createUserSession, action.payload); // This is always required to save the updated user avatar
    yield put({ type: SAVE_TOKEN, payload: response.data });
    window.localStorage.setItem('token', response.data.token);

    // Create game session
    if (action.path === 'lobby') {
      yield put({ type: CREATE_GAME });
      // Action CREATE_GAME will execute further sagas and we want to navigate
      // to the lobby only after action SAVE_GAME is done and game data is loaded in store
      // the "take" effect waits for a certain action on the store
      const { payload } = yield take(SAVE_GAME);

      // Init Socket Connection
      yield put({ type: INIT_SOCKET });

      // Init Game channel
      yield put({ type: INIT_GAME_CHANNEL });

      // Navigate to lobby
      yield put(push(`lobby/${payload?.id}`));
    }
  } catch (error) {
    console.log(error);
    yield put({ type: ADD_ALERT, alertType: 'error', msg: 'Something went wrong when creating user session!' });
  } finally {
    yield put({ type: CLEAR_LOADING });
  }
}

// This SAGA requests for userData using token from server and if present it loads data in store
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

export function* saveGameSession() {
  try {
    const response = yield call(createGame);
    yield put({ type: SAVE_GAME, payload: response.data });
  } catch (error) {
    yield put({ type: ADD_ALERT, alertType: 'error', msg: 'Something went wrong when creating the game session!' });
    console.log('Failed to save game data');
  }
}
