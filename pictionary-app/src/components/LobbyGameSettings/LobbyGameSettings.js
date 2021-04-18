/* eslint-disable camelcase */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { FaClipboard, FaClipboardCheck } from 'react-icons/fa';
import {
  Paper,
  FormGroup,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
  Slider,
  Chip
} from '@material-ui/core';
import './lobbyGameSettings.scss';
import { UPDATE_GAME } from '../../constants/actionTypes';
import NUMBERS from '../../constants/numbers';
import { HOST_URL } from '../../helpers/api';
import { clipboardCopy } from '../../helpers/helpers';

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
  const location = useLocation();

  const [copied, setCopied] = useState(false);
  const [copyTimer, setCopyTimer] = useState(null);

  useEffect(() => () => { clearTimeout(copyTimer); }, []);

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
              placeholder="Type your custom words separated by comma, maximum 30 characters per word and maximum 10000 words"
              multiline
              rows={5}
              rowsMax={4}
              inputProps={{ maxLength: 35000 }}
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
      <div className={`copyLinkContainer ${copied ? 'copiedLinkContainer' : ''}`}>
        <Chip
          label="Invite your friends !"
          clickable
          color="primary"
          icon={copied ? <FaClipboardCheck /> : <FaClipboard />}
          onClick={() => {
            clipboardCopy(`${HOST_URL}${location.pathname}`);
            setCopied(true);
            const timer = setTimeout(() => setCopied(false), 3000);
            setCopyTimer(timer);
          }}
        />
      </div>
    </Paper>
  );
};

export default LobbyGameSettings;
