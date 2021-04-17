import React from 'react';
import Grid from '@material-ui/core/Grid';
import LobbyGameSettings from '../../components/LobbyGameSettings/LobbyGameSettings';
import LobbyUsersList from '../../components/LobbyUsersList/LobbyUsersList';

const Lobby = () => (
  <Grid container spacing={5} justify="center">
    <Grid item xs={4}>
      <LobbyGameSettings />
    </Grid>
    <Grid item lg={5}>
      <LobbyUsersList />
    </Grid>
  </Grid>
);

export default Lobby;
