/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { call, put, select } from 'redux-saga/effects';
import { push } from 'connected-react-router';
import { createUserSession, getUserData } from '../requests/requests';
import { SAVE_TOKEN, ADD_ERROR, LOAD_SESSION } from '../../constants/actionTypes';

// This SAGA fetches users token and saves in store
export function* saveUserSession(action) {
  try {
    const response = yield call(createUserSession, action.payload);
    // put creates the dispatch Effect, its like dispatch({ type: SAVE_TOKEN, payload: token })
    yield put({ type: SAVE_TOKEN, payload: response.data.token });
    if (action.path) yield put(push(action.path));
    window.localStorage.setItem('token', response.data.token);
  } catch (error) {
    console.log(error);
    yield put({ type: ADD_ERROR, payload: 'Something went wrong when creating user session!' });
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
