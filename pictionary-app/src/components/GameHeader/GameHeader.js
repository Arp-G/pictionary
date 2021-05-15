import React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import GameHeaderClock from '../GameHeaderClock/GameHeaderClock';
import GameWordBox from '../GameWordBox/GameWordBox';
import DeleteSvg from '../../images/save.svg';
import './GameHeader.scss';

const GameHeader = () => {
  const [
    totalRounds,
    currentRound,
    currentWord
  ] = useSelector(state => [state.game.rounds, state.gamePlay.currentRound, state.gamePlay.currentWord]);

  return (
    <Grid container>
      <Grid item xs={2} alignContent="center">
        <GameHeaderClock />
      </Grid>
      <Grid item xs={2} spacing={2}>
        <div className="gameRoundText">
          {`Round ${currentRound} of ${totalRounds}`}
        </div>
      </Grid>
      <Grid item xs={6}>
        {currentWord && <GameWordBox />}
      </Grid>
      <Grid item>
        <div className="saveSketch">
          <img src={DeleteSvg} alt="Save" title="Save Sketch" width={35} />
        </div>
      </Grid>
    </Grid>
  );
};

export default GameHeader;
