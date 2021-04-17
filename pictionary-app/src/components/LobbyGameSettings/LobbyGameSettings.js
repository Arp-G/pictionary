/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import { Paper, FormGroup, FormControl, Select, MenuItem, TextField, Checkbox, FormControlLabel, Slider } from '@material-ui/core';
import './lobbyGameSettings.scss';
import NUMBERS from '../../constants/numbers';

const LobbyGameSettings = () => (
  <Paper>
    <header id="lobbyHeader"> Lobby </header>
    <div className="lobbyFormContainer">
      <FormGroup>
        <FormControl variant="outlined" fullWidth margin="dense">
          <span className="customLabel"> Rounds </span>
          <Select>
            {
              [...Array(19).keys()].map(key => (
                <MenuItem value={key + 1}>
                  {NUMBERS[key + 1]}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>

        <FormControl variant="outlined" fullWidth margin="dense">
          <span className="customLabel"> Seconds to Draw </span>
          <Select>
            {
              Array.from(new Array(18), (x, i) => (i + 3) * 10).map(key => (
                <MenuItem value={key}>
                  {key}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>

        <FormControl variant="outlined" fullWidth margin="dense">
          <span className="customLabel"> Maximum Players </span>
          <Select>
            {
              [...Array(24).keys()].map(key => (
                <MenuItem value={key + 1}>
                  {key + 1}
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>

        <FormControl fullWidth margin="dense">
          <span className="customLabel"> Custom words </span>
          <TextField
            placeholder="Type you custom words separated by comma, minimum 4 words and maximum 30 characters per word"
            multiline
            rows={5}
            rowsMax={4}
            variant="filled"
          />
        </FormControl>

        <FormControl fullWidth margin="dense">
          <span className="customLabel"> Custom word probability </span>
          <Slider
            defaultValue={50}
            // getAriaValueText={valuetext}
            min={0}
            max={100}
            valueLabelDisplay="auto"
            className="customWordSlider"
          />
        </FormControl>

        <FormControlLabel
          control={(
            <Checkbox
              checked={true}
              onChange={null}
              name="Public"
              color="primary"
            />
          )}
          label="Public"
        />

        <FormControlLabel
          control={(
            <Checkbox
              checked={true}
              onChange={null}
              name="Allow vote kick"
              color="secondary"
            />
          )}
          label="Allow vote kick"
        />
      </FormGroup>
    </div>
  </Paper>
);

export default LobbyGameSettings;
