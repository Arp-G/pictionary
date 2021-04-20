import {
  TOGGLE_SOUND,
  TOGGLE_DARK_MODE,
  ADD_ALERT,
  CLEAR_ALERT,
  SET_LOADING,
  CLEAR_LOADING,
  SAVE_SOCKET_OBJECT,
  SAVE_GAME_CHANNEL,
  SAVE_GAME_TO_JOIN_ID
} from '../constants/actionTypes';

const initialState = {
  sound: window.localStorage.getItem('userSound') !== 'false',
  darkMode: window.localStorage.getItem('userTheme') === 'true',
  alert: { alertType: null, msg: null },
  loading: false,
  socket: null,
  gameChannel: null,
  gameToJoinId: null
};

const userInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SOUND:
      return { ...state, sound: !state.sound };
    case TOGGLE_DARK_MODE:
      return { ...state, darkMode: !state.darkMode };
    case ADD_ALERT:
      return { ...state, alert: { alertType: action.alertType, msg: action.msg } };
    case CLEAR_ALERT:
      return { ...state, alert: { alertType: null, msg: null } };
    case SET_LOADING:
      return { ...state, loading: true };
    case CLEAR_LOADING:
      return { ...state, loading: false };
    case SAVE_SOCKET_OBJECT:
      return { ...state, socket: action.payload };
    case SAVE_GAME_CHANNEL:
      return { ...state, gameChannel: action.payload };
    case SAVE_GAME_TO_JOIN_ID:
      return { ...state, gameToJoinId: action.payload };
    default:
      return state;
  }
};

export default userInfoReducer;
