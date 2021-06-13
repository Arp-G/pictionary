import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Grid, Paper, makeStyles } from '@material-ui/core';
import GameHeader from '../../components/GameHeader/GameHeader';
import GamePlayersList from '../../components/GamePlayersList/GamePlayersList';
import GameCanvas from '../../components/GameCanvas/GameCanvas';
import GameChat from '../../components/GameChat/GameChat';
import GameToolbar from '../../components/GameToolbar/GameToolbar';
import GameWordChoiceDialog from '../../components/GameWordChoiceDialog/GameWordChoiceDialog';
import GameNewRoundDialog from '../../components/GameNewRoundDialog/GameNewRoundDialog';
import GameWordWasDialog from '../../components/GameWordWasDialog/GameWordWasDialog';
import GameOverDialog from '../../components/GameOverDialog/GameOverDialog';
import GameVoteKickButton from '../../components/GameVoteKickButton/GameVoteKickButton';
import { loadCanvasData } from '../../helpers/helpers';
import { HANDLE_CANVAS_UPDATE, CLEAR_SOCKET, RESET_GAME_STATE, SAVE_GAME_TO_JOIN_ID } from '../../constants/actionTypes';
import './game.scoped.scss';

const useStyles = makeStyles(() => ({ greyPaper: { backgroundColor: 'grey' } }));

const Game = () => {
  const classes = useStyles();

  const [gameId, gameOver, isDrawer, voteKickEnabled, gameChannel] = useSelector(state => [
    state.game.id,
    state.gamePlay.gameOver,
    state.gamePlay.drawerId === state.userInfo.id,
    state.game.vote_kick_enabled,
    state.settings.gameChannel
  ]);

  // Redirect if game channel is null, this avoids errors due to back button press
  if (gameId === null || gameChannel === null) return (<Redirect to={{ pathname: '/' }} />);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const dispatch = useDispatch();

  // If game page is left reset game state and disconnect socket
  useEffect(() => {
    dispatch({ type: SAVE_GAME_TO_JOIN_ID, payload: null });
    return () => {
      dispatch({ type: CLEAR_SOCKET });
      dispatch({ type: RESET_GAME_STATE });
    };
  }, []);

  const [, setRevealInterval] = useState(null);
  const [undoStack, setUndoStack] = useState([]);
  const pushToUndoStack = () => {
    if (!isDrawer || undoStack.length >= 10 || !canvasRef.current) return;

    setUndoStack((stack) => {
      stack.push(canvasRef.current.toDataURL());
      return stack;
    });
  };

  const popUndoStack = () => {
    if (!isDrawer || undoStack.length < 1) return;

    setUndoStack((stack) => {
      const canvasData = stack.pop();
      loadCanvasData(canvasData, (img) => {
        ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctxRef.current.drawImage(img, 0, 0);
        dispatch({ type: HANDLE_CANVAS_UPDATE, payload: canvasRef?.current?.toDataURL() });
      });

      return stack;
    });
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    dispatch({ type: HANDLE_CANVAS_UPDATE, payload: canvasRef?.current?.toDataURL() });
  };

  const clearRevealInterval = () => {
    // Clearing the state inside the setState callback is important
    // since this function colsure does not capture the updated state
    setRevealInterval((currentState) => {
      // eslint-disable-next-line no-console
      console.log(`Clear Word Reveal Interval ${currentState}`);
      clearInterval(currentState);
      return null;
    });
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Paper>
          <GameHeader
            canvasRef={canvasRef}
            setRevealInterval={setRevealInterval}
            clearRevealInterval={clearRevealInterval}
          />
        </Paper>
      </Grid>
      <Grid item xs={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper>
              <GamePlayersList />
            </Paper>
          </Grid>
          {voteKickEnabled && (
            <Grid item xs={12}>
              <GameVoteKickButton />
            </Grid>
          )}
        </Grid>
      </Grid>
      <Grid item xs={8}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper class={classes.greyPaper}>
              <GameCanvas
                pushToUndoStack={pushToUndoStack}
                canvasRef={canvasRef}
                ctxRef={ctxRef}
                isDrawer={isDrawer}
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            {isDrawer && (
              <Paper>
                <GameToolbar
                  popUndoStack={popUndoStack}
                  clearCanvas={clearCanvas}
                />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={2}>
        <GameChat />
      </Grid>
      <Grid item>
        <GameWordChoiceDialog />
        <GameNewRoundDialog />
        <GameWordWasDialog
          clearCanvas={() => {
            clearCanvas();
            // Clear undo stack
            setUndoStack([]);
          }}
          clearRevealInterval={clearRevealInterval}
        />
        {gameOver && <GameOverDialog />}
      </Grid>
    </Grid>
  );
};

export default Game;
