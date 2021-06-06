/* eslint-disable camelcase */
import { SAVE_GAME, UPDATE_GAME_STATE, UPDATE_GAME_PLAYERS, ADMIN_UPDATED, REMOVE_PLAYER } from '../constants/actionTypes';

const initialState = {
  id: null,
  rounds: 3,
  time: 80,
  max_players: 10,
  custom_words: '',
  custom_words_probability: 50,
  public_game: true,
  vote_kick_enabled: true,
  players: [],
  started: false,
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
        started,
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
        started,
        creator_id
      };
    case UPDATE_GAME_STATE:
      return { ...state, ...action.payload };

    case UPDATE_GAME_PLAYERS:
      return { ...state, players: action.payload };

    case ADMIN_UPDATED:
      return { ...state, creator_id: action.payload };

    case REMOVE_PLAYER:
      return { ...state, players: state.players.filter(player => player.id !== action.payload) };

    default:
      return state;
  }
};

export default gameReducer;
