/* eslint-disable import/prefer-default-export */
import { call, put } from 'redux-saga/effects';
import { createUserSession } from '../requests/requests';
import { SAVE_TOKEN } from '../../constants/actionTypes';

// Makes the request and then stores data in store
export function* saveUserSession(action) {
  // try {
  const response = yield call(() => createUserSession(action));
  // eslint-disable-next-line no-console
  console.log(response);
  const { token } = response;
  // put creates the dispatch Effect, its like dispatch({ type: SAVE_TOKEN, payload: token })
  yield put({ type: SAVE_TOKEN, payload: token });
  // } catch (error) {
  //   // TODO: handle errors
  //   // eslint-disable-next-line no-console
  //   console.log(error);
  // }
}
