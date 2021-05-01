import React from 'react';
import { Grid } from '@material-ui/core';
import GameHeaderClock from '../GameHeaderClock/GameHeaderClock';
import DeleteSvg from '../../images/save.svg';
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
        {'elephant man'.split('').map(alphabet => (alphabet === '' ? <div className="alphabetGuessSpace" /> : <div className="alphabetGuess">{alphabet}</div>))}
      </div>
    </Grid>
    <Grid item>
      <div className="saveSketch" >
        <img src={DeleteSvg} alt="Save" title="Save Sketch" width={35} />
      </div>
    </Grid>
  </Grid>
);

export default GameHeader;
