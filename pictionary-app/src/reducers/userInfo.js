import { CHANGE_AVATAR, CHANGE_NAME, SAVE_TOKEN } from '../constants/actionTypes';

const initialState = { avatar: {}, name: '' };
const userInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_NAME:
      return { ...state, name: action.payload };
    case CHANGE_AVATAR:
      return { ...state, avatar: { ...state.avatar, ...action.payload } };
    case SAVE_TOKEN:
      return { ...state, token: action.payload };
    default:
      return state;
  }
};

export default userInfoReducer;
