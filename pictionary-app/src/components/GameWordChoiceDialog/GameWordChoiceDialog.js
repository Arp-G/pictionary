import React from 'react';
import { useSelector } from 'react-redux';
import { Dialog, DialogTitle, DialogActions, Button, makeStyles, withStyles, Slide } from '@material-ui/core';

const dialogTitle = makeStyles({ root: { textAlign: 'center' } });

const WordButton = withStyles(() => ({
  root: {
    backgroundColor: 'grey',
    color: 'white',
    fontWeight: 'bold',
    '&:hover': { backgroundColor: 'green' }
  }
}))(Button);

const GameWordChoiceDialog = ({ active, choosing }) => {
  const classes = dialogTitle();
  // const [word1, word2, word3] = useSelector(state => state.gamePlay.words);
  return (
    <Dialog
      open={active}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      // eslint-disable-next-line react/jsx-props-no-spreading
      TransitionComponent={props => <Slide {...props} direction="up" />}
      maxWidth="lg"
    >
      <DialogTitle className={classes.root}>
        {choosing ? `${choosing} is choosing a word...` : 'Choose a Word'}
      </DialogTitle>
      { !choosing
        && (
        <DialogActions>
          <WordButton variant="contained">
            Word 1
          </WordButton>
          <WordButton variant="contained">
            Word 2
          </WordButton>
          <WordButton variant="contained">
            word 3
          </WordButton>
        </DialogActions>
        )}

    </Dialog>
  );
};

export default GameWordChoiceDialog;
