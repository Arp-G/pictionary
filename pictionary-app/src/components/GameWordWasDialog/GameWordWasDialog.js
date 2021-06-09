/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Dialog, DialogTitle, DialogContent, Slide, makeStyles } from '@material-ui/core';
import Avatar from '../Avatar/Avatar';
import useAudio from '../../hooks/useAudio';
import failSfx from '../../sounds/fail.mp3';
import { RESET_DRAWER } from '../../constants/actionTypes';
import { WS_WORD_WAS } from '../../constants/websocketEvents';
import './GameWordWasDialog.scoped.scss';

const contentStyles = makeStyles({ root: { overflow: 'hidden' } });
// eslint-disable-next-line react/jsx-props-no-spreading
const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const GameWordWasDialog = ({ clearCanvas, clearRevealInterval }) => {
  const [gameChannel, selfId, players] = useSelector(state => [state.settings.gameChannel, state.userInfo.id, state.game.players]);
  const [wordWas, setWordWasDialog] = useState(null);
  const [correctGuessedPlayers, setCorrectGuessedPlayers] = useState({});
  const dispatch = useDispatch();
  const playFailSfx = useAudio(failSfx);

  const dialogContentClasses = contentStyles();

  useEffect(() => {
    let dialogTimer;
    gameChannel.on(WS_WORD_WAS, (payload) => {
      // Clear word reveal interval
      clearRevealInterval();

      dispatch({ type: RESET_DRAWER });
      setWordWasDialog(payload.current_word);
      setCorrectGuessedPlayers(payload.correct_guessed_players);
      dialogTimer = setTimeout(() => {
        setWordWasDialog(null);
        setCorrectGuessedPlayers([]);
      }, 3500);
      clearCanvas();
      // eslint-disable-next-line camelcase
      if (!payload.correct_guessed_players[selfId] && selfId !== payload.drawer_id) return playFailSfx();
    });
    return () => {
      gameChannel.off(WS_WORD_WAS);
      if (dialogTimer) clearTimeout(dialogTimer);
    };
  }, []);

  return wordWas ? (
    <Dialog
      open={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      // eslint-disable-next-line react/jsx-props-no-spreading
      TransitionComponent={Transition}
      maxWidth="lg"
    >
      <DialogTitle>
        The word was "<span className="wordWas">{wordWas}</span>"
      </DialogTitle>

      <DialogContent className={dialogContentClasses.root}>
        <Grid container spacing={5}>
          {
            players
              .sort((player1, player2) => (correctGuessedPlayers[player2.id] || 0) - (correctGuessedPlayers[player1.id] || 0))
              .map((player) => {
                const score = correctGuessedPlayers[player.id] || 0;
                const className = score === 0 ? 'could-not-guess' : 'guessed-correctly';

                return (
                  <Grid item xs={12 / (players.length || 1)} key={player.id}>
                    <div className="playerScoreContainer">
                      <div className={`playerScore ${className}`}>{`+${score}`}</div>
                      <Avatar avatarStyles={player.avatar} width="80px" height="80px" transparent={false} />
                      <div className="playerName">{player.name}</div>
                    </div>
                  </Grid>
                );
              })
          }
        </Grid>
      </DialogContent>
    </Dialog>
  ) : null;
};

export default GameWordWasDialog;
