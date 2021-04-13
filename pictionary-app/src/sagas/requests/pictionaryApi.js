import axios from 'axios';
import { API } from '../../helpers/api';

const axiosInstance = axios.create({ baseURL: API });

const getDefaultHeaders = () => ({
  headers: {
    'Content-type': 'application/json;',
    // TODO: Fix how to store token
    'X-AUTH-TOKEN': ''
  }
});

axiosInstance.interceptors.request.use((config) => {
  // eslint-disable-next-line no-param-reassign
  config.headers = { ...config.header, ...getDefaultHeaders() };
  return config;
},
err => Promise.reject(err)
);

export default axiosInstance;
