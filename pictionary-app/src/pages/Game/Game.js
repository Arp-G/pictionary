import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, Paper } from '@material-ui/core';
import GameHeader from '../../components/GameHeader/GameHeader';
import GamePlayersList from '../../components/GamePlayersList/GamePlayersList';
import GameCanvas from '../../components/GameCanvas/GameCanvas';
import GameChat from '../../components/GameChat/GameChat';
import GameToolbar from '../../components/GameToolbar/GameToolbar';
import GameWordChoiceDialog from '../../components/GameWordChoiceDialog/GameWordChoiceDialog';
import GameNewRoundDialog from '../../components/GameNewRoundDialog/GameNewRoundDialog';
import GameWordWasDialog from '../../components/GameWordWasDialog/GameWordWasDialog';
import GameOverDialog from '../../components/GameOverDialog/GameOverDialog';
import './game.scss';

const Game = () => {
  const gameOver = useSelector(state => state.gamePlay.gameOver);
  return (
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
      <Grid item>
        <GameWordChoiceDialog />
        <GameNewRoundDialog />
        <GameWordWasDialog />
        {gameOver && <GameOverDialog />}
      </Grid>
    </Grid>
  );
};

export default Game;
