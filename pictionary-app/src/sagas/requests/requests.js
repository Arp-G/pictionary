import pictionaryApi from './pictionaryApi';

// eslint-disable-next-line import/prefer-default-export
export const createUserSession = payload => pictionaryApi.post('sessions', payload);

export const getUserData = () => pictionaryApi.get('users');
