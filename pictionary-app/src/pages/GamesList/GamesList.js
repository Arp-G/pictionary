import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { Grid, Paper, List, ListItem, ListItemIcon, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import { ImPencil2 } from 'react-icons/im';
import { FaPlay } from 'react-icons/fa';
import createWebSocketConnection from '../../sagas/websocket';
import { timeSince } from '../../helpers/helpers';
import { SAVE_GAME_TO_JOIN_ID } from '../../constants/actionTypes';
import { WS_GAME_STATS_UPDATED } from '../../constants/websocketEvents';

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

  // max_players: game.max_players,
  //       current_players_count: MapSet.size(game.players),
  //       rounds: game.rounds,
  //       round_time: game.time,
  //       started: game.started,
  //       vote_kick_enabled: game.vote_kick_enabled,
  //       custom_words: length(game.custom_words) != 0,
  //       created_at: game.created_at

  return (
    <Paper>
      <List>
        {
          gamesList.map(game => (
            <ListItem key={game.id} dense>
              <ListItemIcon>
                <ImPencil2 />
              </ListItemIcon>
              <Grid container>
                <Grid item xs={1}>
                  {game.max_players}
                </Grid>

                <Grid item xs={1}>
                  {game.current_players_count}
                </Grid>

                <Grid item xs={1}>
                  {game.rounds}
                </Grid>

                <Grid item xs={1}>
                  {game.round_time}
                </Grid>

                <Grid item xs={1}>
                  {game.started}
                </Grid>

                <Grid item xs={1}>
                  {game.vote_kick_enabled}
                </Grid>

                <Grid item xs={1}>
                  {game.custom_words}
                </Grid>

                <Grid item xs={1}>
                  {`${timeSince(game.created_at)} ago`}
                </Grid>
              </Grid>
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="comments">
                  <FaPlay onClick={() => {
                    // This redirects to home and then to game, this is kinda bad, player should directly enter game or lobby
                    // since (s)he has altready set up character and has valid token at this point
                    dispatch(push(`/game/${game.id}`));
                  }}
                  />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        }
      </List>
    </Paper>
  );
};

export default GamesList;
