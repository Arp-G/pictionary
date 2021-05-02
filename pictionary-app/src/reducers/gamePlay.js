/* eslint-disable camelcase */
import { UPDATE_CANVAS } from '../constants/actionTypes';

const initialState = { canvasData: null };

const gamePlayReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_CANVAS:
      return { ...state, canvasData: action.payload };
    default:
      return state;
  }
};

export default gamePlayReducer;
