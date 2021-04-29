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
      <Grid item xs={12}>
        <GameHeader />
      </Grid>
      <Grid item xs={2}>
        <GamePlayersList />
      </Grid>
      <Grid item xs={7}>
        <GameCanvas />
      </Grid>
      <Grid item xs={3}>
        <GameChat />
      </Grid>
      <Grid item xs={2}>
        <GameToolbar />
      </Grid>
      <Grid item xs={7}>
        <Paper>Paint Items</Paper>
      </Grid>
    </Grid>
  );
};

export default Game;
