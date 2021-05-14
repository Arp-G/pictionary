/* eslint-disable camelcase */
import {
  UPDATE_CANVAS,
  CHANGE_BRUSH_COLOR,
  CHANGE_BRUSH_RADIUS,
  SET_ERASER,
  SET_PEN,
  SET_FILL,
  ADD_MESSAGE,
  UPDATE_DRAWER,
  UPDATE_ROUND,
  UPDATE_SELECTED_WORD,
  UPDATE_SCORE,
  HIDE_ROUND_CHANGE_DIALOG
} from '../constants/actionTypes';

const DEFAULT_BRUSH_COLOR = '#000000';
const DEFAULT_BRUSH_RADIUS = 3;

const initTools = { pen: false, eraser: false, fill: false };
const initialState = {
  ...initTools,
  canvasData: null,
  brushRadius: DEFAULT_BRUSH_RADIUS,
  brushColor: DEFAULT_BRUSH_COLOR,
  pen: true,
  messages: [],
  words: [],
  currentWord: null,
  currentRound: 0,
  roundChangeDialog: false,
  scores: {},
  drawerId: null
};

const gamePlayReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_BRUSH_COLOR:
      return { ...state, ...initTools, brushColor: action.payload, pen: state.pen, fill: state.fill };
    case CHANGE_BRUSH_RADIUS:
      return { ...state, brushRadius: action.payload };
    case SET_ERASER:
      return { ...state, ...initTools, brushColor: '#FFFFFF', brushRadius: 5, eraser: true };
    case SET_PEN:
      return { ...state, ...initTools, pen: true };
    case SET_FILL:
      return { ...state, ...initTools, fill: true };
    case UPDATE_CANVAS:
      return { ...state, canvasData: action.payload };
    case ADD_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    case UPDATE_DRAWER:
      return { ...state, drawerId: action.payload.drawer_id, words: action.payload.words };
    case UPDATE_ROUND:
      return { ...state, currentRound: action.payload, roundChangeDialog: true };
    case UPDATE_SELECTED_WORD:
      return { ...state, words: [], currentWord: action.payload };
    case UPDATE_SCORE:
      return { ...state, scores: action.payload };
    case HIDE_ROUND_CHANGE_DIALOG:
      return { ...state, roundChangeDialog: false };
    default:
      return state;
  }
};

export default gamePlayReducer;
