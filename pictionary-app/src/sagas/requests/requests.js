import pictionaryApi from './pictionaryApi';

export const createUserSession = payload => pictionaryApi.post('sessions', payload);
export const getUserData = () => pictionaryApi.get('users');
export const createGame = () => pictionaryApi.post('games');
