import { Socket } from 'phoenix';
import { WEBSOCKET_API } from '../helpers/api';

export default (token) => {
  const socket = new Socket(WEBSOCKET_API, { params: { token } });
  socket.connect();
  return socket;
};
