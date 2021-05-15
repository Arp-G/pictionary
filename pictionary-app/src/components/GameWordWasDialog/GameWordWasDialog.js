import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Dialog, DialogTitle, Slide } from '@material-ui/core';
import useAudio from '../../hooks/useAudio';
import failSfx from '../../sounds/fail.mp3';
import { WS_WORD_WAS } from '../../constants/websocketEvents';

const GameWordWasDialog = () => {
  const [gameChannel, selfId] = useSelector(state => [state.settings.gameChannel, state.userInfo.id]);
  const [wordWas, setWordWasDialog] = useState(null);
  const playFailSfx = useAudio(failSfx);

  useEffect(() => {
    let dialogTimer;
    gameChannel.on(WS_WORD_WAS, (payload) => {
      setWordWasDialog(payload.current_word);
      dialogTimer = setTimeout(() => setWordWasDialog(null), 3500);

      // eslint-disable-next-line camelcase
      if (!payload.correct_guessed_players.find(player_id => player_id === selfId) && selfId !== payload.drawer_id) {
        console.log('if executed');
        return playFailSfx();
      }
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
      TransitionComponent={props => <Slide {...props} direction="up" />}
      maxWidth="lg"
    >
      <DialogTitle>
        {`The Word was ${wordWas}`}
      </DialogTitle>
    </Dialog>
  ) : null;
};

export default GameWordWasDialog;
