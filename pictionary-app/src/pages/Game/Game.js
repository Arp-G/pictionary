import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import GameHeader from '../../components/GameHeader/GameHeader';
import GamePlayersList from '../../components/GamePlayersList/GamePlayersList';
import GameCanvas from '../../components/GameCanvas/GameCanvas';
import GameChat from '../../components/GameChat/GameChat';
import GameToolbar from '../../components/GameToolbar/GameToolbar';
import './game.scss';

const Game = () => (
  <Grid container spacing={1}>
    <Grid item xs={12}>
      <Paper>
        <GameHeader />
      </Paper>
    </Grid>
    <Grid item xs={2}>
      <Paper>
        <GamePlayersList />
      </Paper>
    </Grid>
    <Grid item xs={8}>
      <Paper>
        <GameCanvas />
      </Paper>
    </Grid>
    <Grid item xs={2}>
      <Paper>
        <GameChat />
      </Paper>
    </Grid>
    <Grid item xs={2}>
      <Paper>
        Vote to Kick
      </Paper>
    </Grid>
    <Grid item xs={8}>
      <Paper>
        <GameToolbar />
      </Paper>
    </Grid>
  </Grid>
);

export default Game;
