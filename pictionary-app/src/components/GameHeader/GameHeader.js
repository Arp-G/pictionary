import React from 'react';
import { Grid } from '@material-ui/core';
import { GiAlarmClock } from 'react-icons/gi';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import GameHeaderClock from '../GameHeaderClock/GameHeaderClock';
import './GameHeader.scss';

const GameHeader = () => (
  <Grid container>
    <Grid item xs={2} alignContent="center">
      <GameHeaderClock />
    </Grid>
    <Grid item xs={2} spacing={2}>
      <div className="gameRoundText">
        Round 1 of 3
      </div>
    </Grid>
    <Grid item xs={6}>
      <div className="alphabetGuessContainer">
        {'elephant'.split('').map(alphabet => (<div className="alphabetGuess">{alphabet}</div>))}
      </div>
    </Grid>
  </Grid>
);

export default GameHeader;
