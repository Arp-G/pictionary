/* eslint-disable import/prefer-default-export */
import { call, put } from 'redux-saga/effects';
import { createUserSession } from '../requests/requests';
import { SAVE_TOKEN, ADD_ERROR } from '../../constants/actionTypes';

// Makes the request and then stores data in store
export function* saveUserSession(action) {
  try {
    const response = yield call(createUserSession, action.payload);
    // put creates the dispatch Effect, its like dispatch({ type: SAVE_TOKEN, payload: token })
    yield put({ type: SAVE_TOKEN, payload: response.data.token });
  } catch (error) {
    yield put({ type: ADD_ERROR, payload: 'Something went wrong when creating user session!' });
  }
}
