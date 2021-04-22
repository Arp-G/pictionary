/* eslint-disable camelcase */
import { SAVE_GAME, UPDATE_GAME_STATE, UPDATE_GAME_PLAYERS } from '../constants/actionTypes';

const initialState = {
  id: null,
  rounds: 3,
  time: 60,
  max_players: 10,
  custom_words: '',
  custom_words_probability: 50,
  public_game: true,
  vote_kick_enabled: true,
  players: [],
  creator_id: null
};

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_GAME:
      const {
        id,
        rounds,
        time,
        max_players,
        custom_words,
        custom_words_probability,
        public_game,
        vote_kick_enabled,
        players,
        creator_id
      } = action.payload;
      return {
        ...state,
        id,
        rounds,
        time,
        max_players,
        custom_words,
        custom_words_probability,
        public_game,
        vote_kick_enabled,
        players,
        creator_id
      };
    case UPDATE_GAME_STATE:
      return { ...state, ...action.payload };

    case UPDATE_GAME_PLAYERS:
      return { ...state, players: action.payload };

    default:
      return state;
  }
};

export default gameReducer;
