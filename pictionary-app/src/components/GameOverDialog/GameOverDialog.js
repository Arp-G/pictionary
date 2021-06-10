import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import Confetti from 'react-confetti';
import { Grid, Dialog, DialogTitle, DialogContent, Slide, makeStyles } from '@material-ui/core';
import Avatar from '../Avatar/Avatar';
import useAudio from '../../hooks/useAudio';
import winnerSfx from '../../sounds/winner.mp3';
import { getWinnerPosition } from '../../helpers/helpers';
import './GameOverDialog.scoped.scss';

const contentStyles = makeStyles({ root: { overflow: 'hidden' } });
const dialogStyles = makeStyles(() => ({ paper: { minWidth: '600px', minHeight: '250px' } }));
// eslint-disable-next-line react/jsx-props-no-spreading
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const GameOverDialog = () => {
  const players = useSelector(state => state.game.players
    .sort((player1, player2) => player2.score - player1.score)
    .slice(0, 3).map((player) => {
      // eslint-disable-next-line no-param-reassign
      player.score = state.gamePlay.scores[player.id] || 0;
      return player;
    }));
  const selfId = useSelector(state => state.userInfo.id);
  const playWinnerSfx = useAudio(winnerSfx);
  const dispatch = useDispatch();

  useEffect(() => {
    if (players.find(({ id }) => selfId === id)) playWinnerSfx();
    const timerRef = setTimeout(() => dispatch(push('/')), 10000);

    return () => clearTimeout(timerRef);
  }, []);

  const dialogContentClasses = contentStyles();
  const dialogClasses = dialogStyles();
  return (
    <Dialog
      open={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      // eslint-disable-next-line react/jsx-props-no-spreading
      TransitionComponent={Transition}
      classes={{ paper: dialogClasses.paper }}
    >
      <DialogTitle>
        <div className="gameOverTitle"> Game Over ! </div>
      </DialogTitle>
      <DialogContent className={dialogContentClasses.root}>
        <Confetti
          width={600}
          height={250}
        />
        <Grid container spacing={10}>
          {
            players.map((player, index) => (
              <Grid item xs={12 / (players.length || 1)} key={player.id}>
                <div className="winnerContainer">
                  <div className="winnerPlace">{getWinnerPosition(index + 1)}</div>
                  <Avatar avatarStyles={player.avatar} width="80px" height="80px" transparent={false} />
                  <div className="winnerName">{player.name}</div>
                </div>
              </Grid>
            ))
          }
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default GameOverDialog;
