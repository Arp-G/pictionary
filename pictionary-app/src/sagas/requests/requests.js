import pictionaryApi from './pictionaryApi';

export const createUserSession = sessionId => pictionaryApi.post('sessions', sessionId);
export const getUserData = () => pictionaryApi.get('users');
export const createGame = () => pictionaryApi.post('games');
export const getGame = gameId => pictionaryApi.get(`games/${gameId}`);
