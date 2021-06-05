import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Grid, Paper } from '@material-ui/core';
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
import { HANDLE_CANVAS_UPDATE, CLEAR_SOCKET, RESET_GAME_STATE } from '../../constants/actionTypes';
import './game.scss';

const Game = () => {
  const [gameId, gameOver, isDrawer, voteKickEnabled] = useSelector(state => [
    state.game.id,
    state.gamePlay.gameOver,
    state.gamePlay.drawerId === state.userInfo.id,
    state.game.vote_kick_enabled
  ]);

  if (gameId === null) return (<Redirect to={{ pathname: '/' }} />);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const dispatch = useDispatch();

  // If game page is left reset game state and disconnect socket
  useEffect(() => () => {
    dispatch({ type: CLEAR_SOCKET });
    dispatch({ type: RESET_GAME_STATE });
  }, []);

  const [, setUndoStack] = useState([]);
  const pushToUndoStack = () => {
    if (!isDrawer || setUndoStack.length >= 10 || !canvasRef.current) return;

    setUndoStack((stack) => {
      stack.push(canvasRef.current.toDataURL());
      return stack;
    });
  };

  const popUndoStack = () => {
    if (!isDrawer || setUndoStack.length < 1) return;

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

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Paper>
          <GameHeader canvasRef={canvasRef} />
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
            <Paper>
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
        />
        {gameOver && <GameOverDialog />}
      </Grid>
    </Grid>
  );
};

export default Game;
