import { TOGGLE_SOUND, TOGGLE_DARK_MODE, ADD_ERROR, CLEAR_ERROR } from '../constants/actionTypes';

const initialState = { sound: true, darkMode: false, error: null };
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
    default:
      return state;
  }
};

export default userInfoReducer;
