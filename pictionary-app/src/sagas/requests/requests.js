import pictionaryApi from './pictionaryApi';

// eslint-disable-next-line import/prefer-default-export
export const createUserSession = action => pictionaryApi.post('sessions', action.payload);
