import { createStore, combineReducers, applyMiddleware } from 'redux';
import userInfo from '../reducers/userInfo';
import settings from '../reducers/settings';
import logger from 'redux-logger';

const rootReducer = combineReducers({ settings: settings, userInfo: userInfo });

const configureStore = () => createStore(rootReducer, applyMiddleware(logger));

export default configureStore;
