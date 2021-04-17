/* eslint-disable camelcase */
import { SAVE_GAME, UPDATE_GAME_STATE } from '../constants/actionTypes';

const initialState = {
  id: null,
  rounds: 3,
  time: 60,
  maxPlayers: 10,
  customWords: '',
  customWordsProbability: 50,
  publicGame: true,
  voteKickEnabled: true,
  players: [],
  creatorId: null
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
        creator_id: creatorId
      } = action.payload;
      return {
        ...state,
        id,
        rounds,
        time,
        maxPlayers: max_players,
        customWords: custom_words,
        customWordsProbability: custom_words_probability,
        publicGame: public_game,
        voteKickEnabled: vote_kick_enabled,
        players,
        creatorId
      };
    case UPDATE_GAME_STATE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default gameReducer;
