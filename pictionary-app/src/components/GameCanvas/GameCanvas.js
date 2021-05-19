/* eslint-disable react/self-closing-comp */
/* eslint-disable camelcase */
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HANDLE_CANVAS_UPDATE } from '../../constants/actionTypes';
import { WS_CANVAS_UPDATED } from '../../constants/websocketEvents';
import './GameCanvas.scss';

const PEN_X_OFFSET = 15;
const PEN_Y_OFFSET = 30;

const GameCanvas = () => {
  const dispatch = useDispatch();
  const [gameChannel, canvasData, isDrawer, brushColor, brushRadius, eraser, pen, fill] = useSelector(state => [
    state.settings.gameChannel,
    state.gamePlay.canvasData,
    state.gamePlay.drawerId === state.userInfo.id,
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
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  if (!isDrawer && canvasData) ctxRef?.current?.loadSaveData(canvasData, true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineWidth = brushRadius;
    ctx.lineCap = 'round';
    ctx.strokeStyle = eraser ? 'white' : brushColor;
    ctxRef.current = ctx;
  }, [canvasData, isDrawer, brushColor, brushRadius, eraser, pen, fill]);

  useEffect(() => {
    gameChannel.on(WS_CANVAS_UPDATED, ({ canvas_data }) => {
      const img = new Image();
      img.src = canvas_data;
      img.onload = () => ctxRef.current.drawImage(img, 0, 0);
    });
    return () => gameChannel.off(WS_CANVAS_UPDATED);
  }, []);

  const draw = ({ nativeEvent: { offsetX, offsetY } }) => {
    if (!isPainting) return;

    ctxRef.current.lineTo(offsetX - PEN_X_OFFSET, offsetY + PEN_Y_OFFSET);
    ctxRef.current.stroke();

    if (isDrawer) dispatch({ type: HANDLE_CANVAS_UPDATE, payload: canvasRef?.current?.toDataURL() });
  };

  const startPosition = ({ nativeEvent: { offsetX, offsetY } }) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX - PEN_X_OFFSET, offsetY + PEN_Y_OFFSET);
    setPainting(true);
  };

  const endPosition = () => {
    ctxRef.current.closePath();
    setPainting(false);
  };

  return (
    <div className={`canvasContainer canvas-${canvasTool}`}>
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
