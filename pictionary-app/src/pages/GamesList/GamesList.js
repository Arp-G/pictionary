/* eslint-disable no-console */
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, Chip, TableRow, IconButton } from '@material-ui/core';
import { FaPlay } from 'react-icons/fa';
import { RiEmotionSadFill } from 'react-icons/ri';
import createWebSocketConnection from '../../sagas/websocket';
import { HANDLE_CREATE_USER_SESSION, HANDLE_JOIN_GAME_FROM_GAMES_LIST_FLOW } from '../../constants/actionTypes';
import { WS_GAME_STATS_UPDATED } from '../../constants/websocketEvents';
import { timeSince } from '../../helpers/helpers';
import './GamesList.scoped.scss';

const columns = [
  { id: 'index', label: 'S.no' },
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

  const saveGamesList = (payload) => {
    const activeGames = (payload.game_stats || [])
      .filter(game => game.current_players_count < game.max_players)
      .map((game, index) => ({ ...game, index: index + 1 }));
    setGamesList(activeGames);
  };

  useEffect(() => {
    const socket = createWebSocketConnection(token);
    const gameListChannel = socket.channel('game_stats', {});

    gameListChannel.join()
      .receive('ok', payload => saveGamesList(payload))
      .receive('error', resp => console.log('Socket connection error', resp))
      .receive('timeout', () => console.log('Socket timeout error'));

    gameListChannel.on(WS_GAME_STATS_UPDATED, payload => saveGamesList(payload));

    return () => socket.disconnect();
  }, []);

  return (
    <Paper className="gamesListWrapper">
      {gamesList.length === 0
        ? (
          <div className="emptyGamesList">
            <RiEmotionSadFill className="icon" />
            <div> No active games found </div>
          </div>
        )
        : (
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map(column => (
                    <TableCell
                      key={column.id}
                      align="justify"
                      style={{ fontWeight: 'bolder', textAlign: 'center' }}
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
                          <IconButton style={{ color: 'green' }}>
                            <FaPlay onClick={() => {
                              // This redirects to home and then to game, this is kinda bad, player should directly enter game or lobby
                              // since (s)he has altready set up character and has valid token at this point

                              dispatch({ type: HANDLE_CREATE_USER_SESSION, flowType: HANDLE_JOIN_GAME_FROM_GAMES_LIST_FLOW, gameToJoinId: row.id });
                            }}
                            />
                          </IconButton>
                        );
                      }

                      return (
                        <TableCell key={column.id} align={column.align} style={{ textAlign: 'center' }}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

    </Paper>
  );
};

export default GamesList;
