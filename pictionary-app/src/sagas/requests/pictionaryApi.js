/* eslint-disable quote-props */
import axios from 'axios';
import { API } from '../../helpers/api';
import { getTokenFromLocalStorage } from '../../helpers/helpers';

const axiosInstance = axios.create({ baseURL: API });
const getDefaultHeaders = () => ({
  'Content-type': 'application/json;',
  'Authorization': getTokenFromLocalStorage() ? `Bearer ${getTokenFromLocalStorage()}` : ''
});

axiosInstance.interceptors.request.use((config) => {
  // eslint-disable-next-line no-param-reassign
  config.headers = { ...config.header, ...getDefaultHeaders() };
  return config;
}, err => Promise.reject(err));

export default axiosInstance;
