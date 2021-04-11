import { TOGGLE_SOUND, TOGGLE_DARK_MODE } from '../constants/actionTypes';

const initialState = { sound: true, darkMode: false };
const userInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SOUND:
      return { ...state, sound: !state.sound };
    case TOGGLE_DARK_MODE:
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
};

export default userInfoReducer;
