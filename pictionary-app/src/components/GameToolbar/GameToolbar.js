/* eslint-disable camelcase */
import { Grid } from '@material-ui/core';
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CirclePicker } from 'react-color';
import colors from '../../constants/gameToolbarColors';
import PencilSvg from '../../images/pencil.svg';
import ErasurSvg from '../../images/eraser.svg';
import PaintJarSvg from '../../images/paint-jar.svg';
import UndoSvg from '../../images/undo.svg';
import DeleteSvg from '../../images/delete.svg';
import { range } from '../../helpers/helpers';
import { CHANGE_BRUSH_COLOR, CHANGE_BRUSH_RADIUS, SET_ERASER, SET_PEN, SET_FILL } from '../../constants/actionTypes';
import './GameToolbar.scoped.scss';

const debounce = require('lodash.debounce');

const GameToolbar = ({ popUndoStack, clearCanvas }) => {
  const dispatch = useDispatch();
  const [brushRadius, brushColor, eraser, pen, fill] = useSelector(state => [
    state.gamePlay.brushRadius,
    state.gamePlay.brushColor,
    state.gamePlay.eraser,
    state.gamePlay.pen,
    state.gamePlay.fill
  ]);

  const customColorPickerRef = useRef(null);

  // It was difficult to make color input a controller input while using debounce so using ref
  useEffect(() => {
    if (customColorPickerRef) customColorPickerRef.current.value = brushColor;
  }, [brushColor]);

  const debounced = debounce(e => dispatch({ type: CHANGE_BRUSH_COLOR, payload: e.target.value }), 500);

  return (
    <Grid container spacing={2}>
      <Grid item>
        <div
          className="color-picker-item"
          title="Color Picker"
          role="button"
          tabIndex={0}
          onInput={debounced}
        >
          <input ref={customColorPickerRef} type="color" className="custom-color-picker" />
        </div>
      </Grid>
      <Grid item>
        <div className="color-picker-item default-colors">
          <CirclePicker
            width="300px"
            onChangeComplete={color => dispatch({ type: CHANGE_BRUSH_COLOR, payload: color.hex })}
            color={brushColor}
            colors={colors}
            circleSize={20}
            circleSpacing={7}
          />
        </div>
      </Grid>
      <Grid item>
        <div
          className={`color-picker-item hoverable ${pen ? 'selected' : ''}`}
          title="Pen"
          role="button"
          tabIndex={0}
          onClick={() => dispatch({ type: SET_PEN })}
        >
          <img src={PencilSvg} alt="pencil" title="Pencil" />
        </div>
      </Grid>
      <Grid item>
        <div
          className={`color-picker-item hoverable ${eraser ? 'selected' : ''}`}
          title="Eraser"
          role="button"
          tabIndex={0}
          label="Eraser"
          onClick={() => dispatch({ type: SET_ERASER })}
        >
          <img src={ErasurSvg} alt="eraser" />
        </div>
      </Grid>
      <Grid item>
        <div
          className={`color-picker-item hoverable ${fill ? 'selected' : ''}`}
          title="Fill Color"
          role="button"
          tabIndex={0}
          label="Fill color"
          onClick={() => dispatch({ type: SET_FILL })}
        >
          <img src={PaintJarSvg} alt="paint-jar" title="Fill color" />
        </div>
      </Grid>
      {
        range(3, 6).map(strokeWidth => (
          <Grid item>
            <div
              className={`strokeContainer ${brushRadius === strokeWidth ? 'selected' : ''}`}
              title="Stroke Width"
              role="button"
              tabIndex={0}
              label="Stroke Width"
              onClick={() => dispatch({ type: CHANGE_BRUSH_RADIUS, payload: strokeWidth })}
            >
              <div
                role="button"
                tabIndex={0}
                label="Pen width"
                className={`color-picker-item strokeItem stroke-${strokeWidth}`}
                title={`Pen width ${strokeWidth}`}
              />
            </div>
          </Grid>
        ))
      }
      <Grid item>
        <div
          className="color-picker-item hoverable"
          title="Undo"
          role="button"
          tabIndex={0}
          label="Undo"
          onClick={popUndoStack}
        >
          <img src={UndoSvg} alt="undo" title="Undo" />
        </div>
      </Grid>
      <Grid item>
        <div
          className="color-picker-item hoverable"
          title="Clear"
          role="button"
          tabIndex={0}
          label="Clear"
          onClick={clearCanvas}
        >
          <img src={DeleteSvg} alt="clear" title="Clear" />
        </div>
      </Grid>
    </Grid>
  );
};

export default GameToolbar;
