/* eslint-disable camelcase */
import React from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import './GameCanvas.scss';

const GameCanvas = () => (
  <div className="canvasContainer">
    <ReactSketchCanvas
      strokeWidth={4}
      strokeColor="red"
    />
  </div>
);

export default GameCanvas;
