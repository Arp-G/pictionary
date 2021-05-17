import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';
import GameHeaderClock from '../GameHeaderClock/GameHeaderClock';
import GameWordBox from '../GameWordBox/GameWordBox';
import { RESET_ELAPSED_TIME } from '../../constants/actionTypes';
import DeleteSvg from '../../images/save.svg';
import './GameHeader.scss';

const GameHeader = () => {
  const [
    totalRounds,
    currentRound,
    currentWord,
    elapsedTime
  ] = useSelector(state => [state.game.rounds, state.gamePlay.currentRound, state.gamePlay.currentWord, state.gamePlay.elapsedTime]);

  const dispatch = useDispatch();
  useEffect(() => dispatch({ type: RESET_ELAPSED_TIME }), []);

  return (
    <Grid container>
      <Grid item xs={2} alignContent="center">
        {currentWord && <GameHeaderClock elapsedTime={elapsedTime} />}
      </Grid>
      <Grid item xs={2} spacing={2}>
        <div className="gameRoundText">
          {`Round ${currentRound} of ${totalRounds}`}
        </div>
      </Grid>
      <Grid item xs={6}>
        {currentWord && <GameWordBox elapsedTime={elapsedTime} />}
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
