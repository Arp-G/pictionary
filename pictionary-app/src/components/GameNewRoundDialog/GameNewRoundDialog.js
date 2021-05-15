import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogTitle, Slide } from '@material-ui/core';
import { HIDE_ROUND_CHANGE_DIALOG } from '../../constants/actionTypes';

const GameNewRoundDialog = () => {
  const [active, currentRound] = useSelector(state => [state.gamePlay.roundChangeDialog, state.gamePlay.currentRound]);
  const dispatch = useDispatch();

  useEffect(() => {
    let dialogTimer;
    if (active) {
      dialogTimer = setTimeout(() => {
        dispatch({ type: HIDE_ROUND_CHANGE_DIALOG });
      }, 2000);
    }
    return () => dialogTimer && clearTimeout(dialogTimer);
  }, [active]);

  return active ? (
    <Dialog
      open={true}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      // eslint-disable-next-line react/jsx-props-no-spreading
      TransitionComponent={props => <Slide {...props} direction="up" />}
      maxWidth="lg"
    >
      <DialogTitle>
        {`Round ${currentRound}`}
      </DialogTitle>
    </Dialog>
  ) : null;
};

export default GameNewRoundDialog;
