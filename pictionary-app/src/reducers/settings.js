import {
  TOGGLE_SOUND,
  TOGGLE_DARK_MODE,
  ADD_ERROR,
  CLEAR_ERROR,
  SET_LOADING,
  CLEAR_LOADING,
  SAVE_SOCKET_OBJECT,
  SAVE_GAME_CHANNEL
} from '../constants/actionTypes';

const initialState = {
  sound: window.localStorage.getItem('userSound') !== 'false',
  darkMode: window.localStorage.getItem('userTheme') === 'true',
  error: null,
  loading: false,
  socket: null,
  gameChannel: null
};

const userInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SOUND:
      return { ...state, sound: !state.sound };
    case TOGGLE_DARK_MODE:
      return { ...state, darkMode: !state.darkMode };
    case ADD_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_ERROR:
      return { ...state, error: null };
    case SET_LOADING:
      return { ...state, loading: true };
    case CLEAR_LOADING:
      return { ...state, loading: false };
    case SAVE_SOCKET_OBJECT:
      return { ...state, socket: action.payload };
    case SAVE_GAME_CHANNEL:
      return { ...state, gameChannel: action.payload };
    default:
      return state;
  }
};

export default userInfoReducer;
