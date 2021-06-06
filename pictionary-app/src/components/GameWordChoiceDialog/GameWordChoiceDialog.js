import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogTitle, DialogActions, Button, makeStyles, withStyles, Slide } from '@material-ui/core';
import { HANDLE_UPDATE_SELECTED_WORD } from '../../constants/actionTypes';

const dialogTitle = makeStyles({ root: { textAlign: 'center' } });

const WordButton = withStyles(() => ({
  root: {
    backgroundColor: 'grey',
    color: 'white',
    fontWeight: 'bold',
    '&:hover': { backgroundColor: 'green' }
  }
}))(Button);

const GameWordChoiceDialog = () => {
  const classes = dialogTitle();
  const words = useSelector(state => state.gamePlay.words);
  const [choosing, chooserName] = useSelector((state) => {
    const drawer = state.game.players.find(player => player.id === state.gamePlay.drawerId);
    return [state.gamePlay.drawerId === state.userInfo.id, (drawer?.name || 'Anonymous')];
  });
  const active = useSelector(state => state.gamePlay.words.length !== 0);
  const dispatch = useDispatch();

  return active ? (
    <Dialog
      open={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      // eslint-disable-next-line react/jsx-props-no-spreading
      TransitionComponent={props => <Slide {...props} direction="up" />}
      maxWidth="lg"
    >
      <DialogTitle className={classes.root}>
        {choosing ? 'Choose a Word' : `${chooserName} is choosing a word...`}
      </DialogTitle>
      { choosing
        && (
          <DialogActions>
            {words.map(([type, word]) => (
              <WordButton key={word} variant="contained" onClick={() => dispatch({ type: HANDLE_UPDATE_SELECTED_WORD, payload: [type, word] })}>
                {word}
              </WordButton>
            ))}
          </DialogActions>
        )}
    </Dialog>
  ) : null;
};

export default GameWordChoiceDialog;
