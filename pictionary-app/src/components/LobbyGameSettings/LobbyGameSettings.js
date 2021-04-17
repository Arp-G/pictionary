import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Paper,
  FormGroup,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  Slider
} from '@material-ui/core';
import './lobbyGameSettings.scss';
import { UPDATE_GAME } from '../../constants/actionTypes';
import NUMBERS from '../../constants/numbers';

const LobbyGameSettings = () => {
  const dispatch = useDispatch();
  const {
    rounds,
    time,
    maxPlayers,
    customWords,
    customWordsProbability,
    publicGame,
    voteKickEnabled
  } = useSelector(state => state.game);

  return (
    <Paper>
      <header id="lobbyHeader"> Lobby </header>
      <div className="lobbyFormContainer">
        <FormGroup>
          <FormControl variant="outlined" fullWidth margin="dense">
            <span className="customLabel"> Rounds </span>
            <Select
              value={rounds}
              onChange={e => dispatch({ type: UPDATE_GAME, payload: { rounds: e.target.value } })}
            >
              {
                [...Array(19).keys()].map(key => (
                  <MenuItem value={key + 1} key={key}>
                    {NUMBERS[key + 1]}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>

          <FormControl variant="outlined" fullWidth margin="dense">
            <span className="customLabel"> Seconds to Draw </span>
            <Select
              value={time}
              onChange={e => dispatch({ type: UPDATE_GAME, payload: { time: e.target.value } })}
            >
              {
                Array.from(new Array(18), (x, i) => (i + 3) * 10).map(key => (
                  <MenuItem value={key} key={key}>
                    {key}
                  </MenuItem>
                ))
              }
            </Select>
          </FormControl>

          <FormControl variant="outlined" fullWidth margin="dense">
            <span className="customLabel"> Maximum Players </span>
            <Select
              value={maxPlayers}
              onChange={e => dispatch({ type: UPDATE_GAME, payload: { maxPlayers: e.target.value } })}
            >
              {
                [...Array(24).keys()].map(key => (
                  <MenuItem value={key + 1} key={key}>
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
              value={customWords}
              onChange={e => dispatch({ type: UPDATE_GAME, payload: { customWords: e.target.value } })}
            />
          </FormControl>

          <FormControl fullWidth margin="dense">
            <span className="customLabel"> Custom word probability </span>
            <Slider
              min={0}
              max={100}
              valueLabelDisplay="auto"
              className="customWordSlider"
              value={customWordsProbability}
              onChange={(_event, value) => dispatch({ type: UPDATE_GAME, payload: { customWordsProbability: value } })}
            />
          </FormControl>

          <FormControlLabel
            control={(
              <Checkbox
                checked={publicGame}
                onChange={e => dispatch({ type: UPDATE_GAME, payload: { publicGame: e.target.checked } })}
                name="Public"
                color="primary"
              />
            )}
            label="Public"
          />

          <FormControlLabel
            control={(
              <Checkbox
                checked={voteKickEnabled}
                onChange={e => dispatch({ type: UPDATE_GAME, payload: { voteKickEnabled: e.target.checked } })}
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
};

export default LobbyGameSettings;
