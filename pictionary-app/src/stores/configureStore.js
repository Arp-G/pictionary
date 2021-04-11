import { createStore, combineReducers, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import userInfo from '../reducers/userInfo';
import settings from '../reducers/settings';

const rootReducer = combineReducers({ settings, userInfo });
const configureStore = () => createStore(rootReducer, applyMiddleware(logger));
export default configureStore;
