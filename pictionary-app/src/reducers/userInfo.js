import { CHANGE_AVATAR, CHANGE_NAME } from '../constants/actionTypes';

const initialState = { avatar: {}, name: '' };
const userInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_NAME:
      return { ...state, name: action.payload };
    case CHANGE_AVATAR:
      return { ...state, avatar: { ...state.avatar, ...action.payload } };

    default:
      return state;
  }
};

export default userInfoReducer;
