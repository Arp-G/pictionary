import { Socket } from 'phoenix';
import { WEBSOCKET_API } from '../helpers/api';

export default (token) => {
  const socket = new Socket(WEBSOCKET_API,
    {
      params: { token },
      logger: (kind, msg, data) => (
        // eslint-disable-next-line no-console
        console.log(`${kind}: ${msg}`, data)
      )
    }
  );
  socket.connect();
  return socket;
};
