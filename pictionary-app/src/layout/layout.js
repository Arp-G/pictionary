import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BsFillVolumeUpFill, BsFillVolumeMuteFill, BsSun, BsMoon } from 'react-icons/bs';
import useSound from 'use-sound';
import { TOGGLE_SOUND, TOGGLE_DARK_MODE } from '../constants/actionTypes';
import soundToggleSfx from '../sounds/sound.mp3';
import ErrorBoundary from '../misc/errorBoundary';
import './layout.scss';

const Layout = ({ children }) => {
  const sound = useSelector(state => state.settings.sound);
  const darkMode = useSelector(state => state.settings.darkMode);
  const dispatch = useDispatch();
  const [playSoundSfx] = useSound(soundToggleSfx, { volume: 0.3 });

  const toggleSound = () => {
    playSoundSfx();
    return dispatch({ type: TOGGLE_SOUND });
  };

  const toggleDarkMode = () => dispatch({ type: TOGGLE_DARK_MODE });

  const theme = createMuiTheme({ palette: { type: darkMode ? 'dark' : 'light' } });

  return (
    <ThemeProvider theme={theme}>
      <div className={`${darkMode ? 'bg dark-mode-bg' : 'bg'}`} />
      <Grid container className={`main-wrapper-container ${darkMode && 'darkMode'}`}>
        <ErrorBoundary>
          <Grid item xs={1}>
            <Grid item xs={12}>
              {sound ? (
                <BsFillVolumeUpFill onClick={toggleSound} size="2em" className="toggleIcon" />
              ) : (
                <BsFillVolumeMuteFill onClick={toggleSound} size="2em" className="toggleIcon" />
              )}
            </Grid>
            <Grid item xs={12}>
              {darkMode ? (
                <BsSun onClick={toggleDarkMode} size="2em" className="toggleIcon sunIcon" />
              ) : (
                <BsMoon onClick={toggleDarkMode} size="2em" className="toggleIcon" />
              )}
            </Grid>
          </Grid>
        </ErrorBoundary>
        <Grid item xs={12}>
          <ErrorBoundary>
            <Container maxWidth="xl">{children}</Container>
          </ErrorBoundary>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Layout;
