import React from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@material-ui/core';
import GameHeaderClock from '../GameHeaderClock/GameHeaderClock';
import DeleteSvg from '../../images/save.svg';
import './GameHeader.scss';

const GameHeader = () => {
  const [totalRounds, currentRound] = useSelector(state => [state.game.rounds, state.gamePlay.currentRound]);
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
        <div className="alphabetGuessContainer">
          {
          'elephant man'
            .split('')
            .map(alphabet => (alphabet === '' ? <div className="alphabetGuessSpace" /> : <div className="alphabetGuess">{alphabet}</div>))
          }
        </div>
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
