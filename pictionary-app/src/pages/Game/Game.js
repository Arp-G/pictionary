import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import GameHeader from '../../components/GameHeader/GameHeader';
import GamePlayersList from '../../components/GamePlayersList/GamePlayersList';
import GameCanvas from '../../components/GameCanvas/GameCanvas';
import GameChat from '../../components/GameChat/GameChat';
import GameToolbar from '../../components/GameToolbar/GameToolbar';
import './game.scss';

const Game = () => {
  // const dispatch = useDispatch();

  return (
    <Grid container>
      <Grid item xs={12} component={Paper}>
        <GameHeader />
      </Grid>
      <Grid item xs={2} component={Paper}>
        <GamePlayersList />
      </Grid>
      <Grid item xs={7} component={Paper}>
        <GameCanvas />
      </Grid>
      <Grid item xs={3} component={Paper}>
        <GameChat />
      </Grid>
      <Grid item xs={2} component={Paper}>
        <GameToolbar />
      </Grid>
      <Grid item xs={7} component={Paper}>
        <Paper>Paint Items</Paper>
      </Grid>
    </Grid>
  );
};

export default Game;
