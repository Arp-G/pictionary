/* eslint-disable no-param-reassign */
/* eslint-disable react/self-closing-comp */
/* eslint-disable camelcase */
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HANDLE_CANVAS_UPDATE } from '../../constants/actionTypes';
import { WS_CANVAS_UPDATED } from '../../constants/websocketEvents';
import { loadCanvasData } from '../../helpers/helpers';
import floodFill from '../../helpers/floodFill';
import './GameCanvas.scss';

const PEN_X_OFFSET = 15;
const PEN_Y_OFFSET = 30;

const GameCanvas = ({ pushToUndoStack, canvasRef, ctxRef, isDrawer }) => {
  const dispatch = useDispatch();
  const [gameChannel, canvasData, brushColor, brushRadius, eraser, pen, fill] = useSelector(state => [
    state.settings.gameChannel,
    state.gamePlay.canvasData,
    state.gamePlay.brushColor,
    state.gamePlay.brushRadius,
    state.gamePlay.eraser,
    state.gamePlay.pen,
    state.gamePlay.fill
  ]);

  let canvasTool = 'disabled';

  if (!isDrawer) canvasTool = 'disabled';
  else if (pen) canvasTool = 'pen';
  else if (eraser) canvasTool = 'eraser';
  else if (fill) canvasTool = 'fill';

  const [isPainting, setPainting] = useState(false);

  const canvasContainerRef = useRef(null);

  const resizeCanvas = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    // canvas data is lost and context is reset on window resize
    // store canvas content in an in-memory canvas and restore it on reisze
    const inMemCanvas = document.createElement('canvas');
    const inMemCtx = inMemCanvas.getContext('2d');

    inMemCanvas.width = canvas.width;
    inMemCanvas.height = canvas.height;
    inMemCtx.drawImage(canvas, 0, 0); // Save canvas content in in-memory canvas

    // Resize canvas to fit parent container width
    canvasRef.current.width = canvasContainerRef.current.offsetWidth - 5;
    canvasRef.current.height = canvasContainerRef.current.offsetHeight - 5;

    // Restore canvas content from in-memory canvas
    ctx.drawImage(inMemCanvas, 0, 0);
  };

  const clearAndDrawOnCanvas = (img) => {
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    ctxRef.current.drawImage(img, 0, 0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = brushRadius;
    ctx.lineCap = 'round';
    ctx.strokeStyle = eraser ? 'white' : brushColor;
    ctxRef.current = ctx;
  }, [canvasData, isDrawer, brushColor, brushRadius, eraser, pen, fill]);

  useEffect(() => {
    // set canvas size on load to canvas container div
    // Canvas cannot be resized by css, it will pixelate
    resizeCanvas();

    // When player joins ongoing game paint canvas with current game state
    if (canvasData) loadCanvasData(canvasData, clearAndDrawOnCanvas);

    gameChannel.on(WS_CANVAS_UPDATED, ({ canvas_data }) => {
      loadCanvasData(canvas_data, clearAndDrawOnCanvas);

      // Resize canvas on window resize
      window.onresize = resizeCanvas;
      return () => {
        gameChannel.off(WS_CANVAS_UPDATED);
        window.removeEventListener('onresize', resizeCanvas, false);
      };
    });
  }, []);

  const draw = ({ nativeEvent: { offsetX, offsetY } }) => {
    if (!isDrawer || !isPainting) return;

    ctxRef.current.lineTo(offsetX - PEN_X_OFFSET, offsetY + PEN_Y_OFFSET);
    ctxRef.current.stroke();

    if (isDrawer) dispatch({ type: HANDLE_CANVAS_UPDATE, payload: canvasRef?.current?.toDataURL() });
  };

  const startPosition = (event) => {
    if (!isDrawer) return;
    // Save current canvas state for undo functionality
    pushToUndoStack();

    if (fill) {
      floodFill(event, canvasRef.current, ctxRef.current, brushColor);
      dispatch({ type: HANDLE_CANVAS_UPDATE, payload: canvasRef?.current?.toDataURL() });
      return;
    }
    const { nativeEvent: { offsetX, offsetY } } = event;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX - PEN_X_OFFSET, offsetY + PEN_Y_OFFSET);
    setPainting(true);
  };

  const endPosition = () => {
    ctxRef.current.closePath();
    setPainting(false);
  };

  return (
    <div className={`canvasContainer canvas-${canvasTool}`} ref={canvasContainerRef}>
      <canvas
        onMouseDown={startPosition}
        onMouseUp={endPosition}
        onMouseLeave={endPosition}
        onMouseMove={draw}
        ref={canvasRef}
      >
      </canvas>
    </div>
  );
};

export default GameCanvas;
