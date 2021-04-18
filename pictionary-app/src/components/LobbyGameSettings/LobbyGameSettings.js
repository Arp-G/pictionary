/* eslint-disable camelcase */
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
    max_players,
    custom_words,
    custom_words_probability,
    public_game,
    vote_kick_enabled
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
              value={max_players}
              onChange={e => dispatch({ type: UPDATE_GAME, payload: { max_players: e.target.value } })}
            >
              {
                [...Array(23).keys()].map(key => (
                  <MenuItem value={key + 2} key={key}>
                    {key + 2}
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
              value={custom_words}
              onChange={e => dispatch({ type: UPDATE_GAME, payload: { custom_words: e.target.value } })}
            />
          </FormControl>

          <FormControl fullWidth margin="dense">
            <span className="customLabel"> Custom word probability </span>
            <Slider
              min={0}
              max={100}
              valueLabelDisplay="auto"
              className="customWordSlider"
              value={custom_words_probability}
              onChange={(_event, value) => dispatch({ type: UPDATE_GAME, payload: { custom_words_probability: value } })}
            />
          </FormControl>

          <FormControlLabel
            control={(
              <Checkbox
                checked={public_game}
                onChange={e => dispatch({ type: UPDATE_GAME, payload: { public_game: e.target.checked } })}
                name="Public"
                color="primary"
              />
            )}
            label="Public"
          />

          <FormControlLabel
            control={(
              <Checkbox
                checked={vote_kick_enabled}
                onChange={e => dispatch({ type: UPDATE_GAME, payload: { vote_kick_enabled: e.target.checked } })}
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
