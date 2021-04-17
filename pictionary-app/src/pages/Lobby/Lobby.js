import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import LobbyGameSettings from '../../components/LobbyGameSettings/LobbyGameSettings';
import LobbyUsersList from '../../components/LobbyUsersList/LobbyUsersList';

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
          <LobbyUsersList />
        </Grid>
      </Grid>
    );
};

export default Lobby;
