import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import LobbyGameSettings from '../../components/LobbyGameSettings/LobbyGameSettings';
import LobbyPlayersList from '../../components/LobbyPlayersList/LobbyPlayersList';

const Lobby = () => {
  const gameId = useSelector(state => state.game.id);

  return gameId === null
    ? <Redirect to={{ pathname: '/' }} />
    : (
      <Grid container spacing={5} justify="center">
        <Grid item xs={4}>
          <LobbyGameSettings />
        </Grid>
        <Grid item lg={5}>
          <LobbyPlayersList />
        </Grid>
      </Grid>
    );
};

export default Lobby;
