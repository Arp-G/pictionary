import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import createWebSocketConnection from '../../sagas/websocket';
import { WS_GAME_STATS_UPDATED } from '../../constants/websocketEvents';

const GamesList = () => {
  const dispatch = useDispatch();
  const [gamesList, setGamesList] = useState([]);
  const token = useSelector(state => state.userInfo.token);

  useEffect(() => {
    const socket = createWebSocketConnection(token);
    const gameListChannel = socket.channel('game_stats', {});

    gameListChannel.join()
      .receive('ok', (payload) => setGamesList(payload))
      .receive('error', resp => console.log('Error 1 ', resp))
      .receive('timeout', () => console.log('Error 2 '));

    gameListChannel.on(WS_GAME_STATS_UPDATED, payload => setGamesList(payload.game_stats));

    return () => socket.disconnect();
  }, []);

  return (<ul>{gamesList.map(game => <li>{JSON.stringify(game)}</li>)}</ul>);
};

export default GamesList;
