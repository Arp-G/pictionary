/* eslint-disable camelcase */
import { Grid, Paper } from '@material-ui/core';
import React from 'react';
import { CirclePicker } from 'react-color';
import colors from '../../constants/gameToolbarColors';
import PencilSvg from '../../images/pencil.svg';
import ErasurSvg from '../../images/eraser.svg';
import PaintJarSvg from '../../images/paint-jar.svg';
import UndoSvg from '../../images/undo.svg';
import DeleteSvg from '../../images/delete.svg';
import { range } from '../../helpers/helpers';
import './GameToolbar.scss';

const GameToolbar = () => (
  <Grid container spacing={2}>
    <Grid item>
      <div className="color-picker-item">
        <input type="color" className="custom-color-picker" />
      </div>
    </Grid>
    <Grid item>
      <div className="color-picker-item default-colors">
        <CirclePicker
          width="300px"
          onChangeComplete={color => console.log(`User selected color ${color}`)}
          color={colors[12]}
          colors={colors}
          circleSize={20}
          circleSpacing={7}
        />
      </div>
    </Grid>
    <Grid item>
      <div className="color-picker-item hoverable">
        <img src={PencilSvg} alt="pencil" title="Pencil" />
      </div>
    </Grid>
    <Grid item>
      <div className="color-picker-item hoverable">
        <img src={ErasurSvg} alt="eraser" title="Eraser" />
      </div>
    </Grid>
    <Grid item>
      <div className="color-picker-item hoverable">
        <img src={PaintJarSvg} alt="paint-jar" title="Fill color" />
      </div>
    </Grid>
    {
      range(1, 4).map(strokeWidth => (
        <Grid item>
          <div className="strokeContainer">
            <div className={`color-picker-item strokeItem stroke-${strokeWidth}`} title={`Pen width ${strokeWidth}`}/>
          </div>
        </Grid>
      ))
    }
    <Grid item>
      <div className="color-picker-item hoverable">
        <img src={UndoSvg} alt="undo" title="Undo" />
      </div>
    </Grid>
    <Grid item>
      <div className="color-picker-item hoverable">
        <img src={DeleteSvg} alt="clear" title="Clear" />
      </div>
    </Grid>
  </Grid>
);

export default GameToolbar;
