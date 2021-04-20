import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, useParams } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import { SAVE_GAME_TO_JOIN_ID } from '../../constants/actionTypes';
import LobbyGameSettings from '../../components/LobbyGameSettings/LobbyGameSettings';
import LobbyUsersList from '../../components/LobbyUsersList/LobbyUsersList';

const Lobby = () => {
  const gameId = useSelector(state => state.game.id);
  const dispatch = useDispatch();
  // eslint-disable-next-line camelcase
  const { game_id: gameToJoinId } = useParams();

  if (gameToJoinId) dispatch({ type: SAVE_GAME_TO_JOIN_ID, payload: gameToJoinId });

  return gameId === null
    ? <Redirect to={{ pathname: '/' }} />
    : (
      <Grid container spacing={5} justify="center">
        <Grid item xs={4}>
          <LobbyGameSettings />
        </Grid>
        <Grid item lg={5}>
          <LobbyUsersList />
        </Grid>
      </Grid>
    );
};

export default Lobby;
