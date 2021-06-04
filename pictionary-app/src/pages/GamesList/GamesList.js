import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { Paper, List, Table, TableBody, TableCell, TableContainer, TableHead, Chip, TableRow, IconButton } from '@material-ui/core';
import { ImPencil2 } from 'react-icons/im';
import { FaPlay } from 'react-icons/fa';
import createWebSocketConnection from '../../sagas/websocket';
import { timeSince } from '../../helpers/helpers';
import { SAVE_GAME_TO_JOIN_ID } from '../../constants/actionTypes';
import { WS_GAME_STATS_UPDATED } from '../../constants/websocketEvents';

// max_player current_player_count rounds round_time started vote kick custom word time
const columns = [
  { id: 'max_players', label: 'Max Players' },
  { id: 'current_players_count', label: 'Active Players' },
  { id: 'rounds', label: 'Rounds' },
  { id: 'round_time', label: 'Draw Time' },
  { id: 'started', label: 'Status' },
  { id: 'vote_kick_enabled', label: 'Vote Kick' },
  { id: 'custom_words', label: 'Custom Words' },
  { id: 'created_at', label: 'Elapsed Time' },
  { id: 'join_game', label: 'Join Game' }
];

const GamesList = () => {
  const dispatch = useDispatch();
  const [gamesList, setGamesList] = useState([]);
  const token = useSelector(state => state.userInfo.token);

  useEffect(() => {
    const socket = createWebSocketConnection(token);
    const gameListChannel = socket.channel('game_stats', {});

    gameListChannel.join()
      .receive('ok', payload => setGamesList(payload))
      .receive('error', resp => console.log('Error 1 ', resp))
      .receive('timeout', () => console.log('Error 2 '));

    gameListChannel.on(WS_GAME_STATS_UPDATED, payload => setGamesList(payload.game_stats));

    return () => socket.disconnect();
  }, []);

  return (
    <Paper>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(column => (
                <TableCell
                  key={column.id}
                  align="justify"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {gamesList.map(row => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                {columns.map((column) => {
                  let value = column.id === 'created_at' ? `${timeSince(row[column.id])} ago` : row[column.id];

                  if (column.id === 'started') {
                    value = value
                      ? <Chip label="Started" style={{ backgroundColor: 'green' }} />
                      : <Chip label="In Lobby" color="secondary" style={{ backgroundColor: '#8B8000' }} />;
                  } else if (column.id === 'vote_kick_enabled') {
                    value = value ? <Chip label="Enabled" color="primary" /> : <Chip label="Disabled" color="secondary" />;
                  } else if (column.id === 'custom_words') {
                    value = value ? <Chip label="Yes" style={{ backgroundColor: 'green', color: 'white' }} /> : <Chip label="No" color="secondary" />;
                  } else if (column.id === 'join_game') {
                    value = (
                      <IconButton edge="end" aria-label="comments">
                        <FaPlay onClick={() => {
                          // This redirects to home and then to game, this is kinda bad, player should directly enter game or lobby
                          // since (s)he has altready set up character and has valid token at this point
                          dispatch(push(`/game/${row.id}`));
                        }}
                        />
                      </IconButton>
                    );
                  }

                  return (
                    <TableCell key={column.id} align={column.align}>
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default GamesList;
