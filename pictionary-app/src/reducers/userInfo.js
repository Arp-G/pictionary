import { CHANGE_AVATAR, CHANGE_NAME, SAVE_TOKEN, LOAD_SESSION } from '../constants/actionTypes';
import { getRandomAvatarStyles } from '../helpers/helpers';

const initialState = { id: null, avatar: getRandomAvatarStyles(), name: '', token: window.localStorage.getItem('token') || null };
const userInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_NAME:
      return { ...state, name: action.payload };
    case CHANGE_AVATAR:
      return { ...state, avatar: { ...state.avatar, ...action.payload } };
    case SAVE_TOKEN:
      return { ...state, token: action.payload.token, id: action.payload.user.id };
    case LOAD_SESSION:
      return { ...state, id: action.payload.id, name: action.payload.name, avatar: action.payload.avatar };
    default:
      return state;
  }
};

export default userInfoReducer;
