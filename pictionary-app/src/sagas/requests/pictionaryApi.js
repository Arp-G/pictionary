/* eslint-disable quote-props */
import axios from 'axios';
import { API } from '../../helpers/api';

const axiosInstance = axios.create({ baseURL: API });
const token = window.localStorage.getItem('token');

const getDefaultHeaders = () => ({
  'Content-type': 'application/json;',
  'Authorization': token ? `Bearer ${token}` : ''
});

axiosInstance.interceptors.request.use((config) => {
  // eslint-disable-next-line no-param-reassign
  config.headers = { ...config.header, ...getDefaultHeaders() };
  return config;
}, err => Promise.reject(err));

export default axiosInstance;
