export const SITE_URL = process.env.REACT_APP_SITE_URL || 'http://localhost:4000';
export const HOST_URL = process.env.REACT_APP_HOST_URL || 'http://localhost:3000';
export const API = `${SITE_URL}/api`;
export const WEBSOCKET_API = `${SITE_URL.replace('http', 'ws').replace('https', 'ws')}/socket`;
