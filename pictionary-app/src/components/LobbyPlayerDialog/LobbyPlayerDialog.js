import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import { GiWalkingBoot, GiChessKing } from 'react-icons/gi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { HANDLE_UPDATE_ADMIN, HANDLE_KICK_PLAYER } from '../../constants/actionTypes';
import './lobbyPlayerDialog.scoped.scss';

export default ({ open, player, closeDialog }) => {
  const dispatch = useDispatch();

  return (
    <Dialog open={open} onClose={closeDialog}>
      <DialogContent style={{ overflow: 'hidden' }}>
        <AiFillCloseCircle className="closeButton" onClick={closeDialog} />
        <DialogTitle>Player Actions</DialogTitle>
        <DialogActions>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<GiWalkingBoot />}
            onClick={() => {
              dispatch({ type: HANDLE_KICK_PLAYER, payload: player?.id });
              closeDialog();
            }}
          >
            {`Kick ${player?.name}!`}
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<GiChessKing />}
            onClick={() => {
              dispatch({ type: HANDLE_UPDATE_ADMIN, payload: player?.id });
              closeDialog();
            }}
          >
            Make admin!
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
