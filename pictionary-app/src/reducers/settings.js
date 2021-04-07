import { TOGGLE_SOUND } from '../constants/actionTypes';
const initialState = { sound: true };
const userInfoReducer = (state = initialState, action) => {

    switch (action.type) {
        case TOGGLE_SOUND:
            return { ...state, sound: !state.sound }
        default:
            return state;
    }
}

export default userInfoReducer;
