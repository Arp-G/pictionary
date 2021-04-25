import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Dialog } from '@material-ui/core';
import DialogActions from '@material-ui/core/DialogActions';
import { GiWalkingBoot, GiChessKing } from 'react-icons/gi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { UPDATE_GAME_ADMIN, KICK_PLAYER } from '../../constants/actionTypes';
import './lobbyPlayerDialog.scss';

export default ({ open, player, closeDialog }) => {
  const dispatch = useDispatch();

  return (
    <Dialog open={open} onClose={closeDialog}>
      <AiFillCloseCircle className="closeButton" onClick={closeDialog} />
      <DialogActions>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<GiWalkingBoot />}
          onClick={() => {
            dispatch({ type: KICK_PLAYER, payload: player?.id });
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
            dispatch({ type: UPDATE_GAME_ADMIN, payload: player?.id });
            closeDialog();
          }}
        >
          Make admin!
        </Button>
      </DialogActions>
    </Dialog>
  );
};
