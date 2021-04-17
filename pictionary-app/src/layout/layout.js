import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BsFillVolumeUpFill, BsFillVolumeMuteFill, BsSun, BsMoon } from 'react-icons/bs';
import LoadingScreen from '../pages/loading/loading';
import { CLEAR_ERROR } from '../constants/actionTypes';
import ErrorBoundary from '../misc/errorBoundary';
import useDarkMode from '../hooks/useDarkMode';
import useSfx from '../hooks/useSfx';
import './layout.scss';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const error = useSelector(state => state.settings.error);
  const loading = useSelector(state => state.settings.loading);
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sound, toggleSound] = useSfx();
  const theme = createMuiTheme({ palette: { type: darkMode ? 'dark' : 'light' } });

  useEffect(() => {
    let timer;
    if (error) timer = setTimeout(() => dispatch({ type: CLEAR_ERROR }), 5000);
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <ThemeProvider theme={theme}>
      <div className={`${darkMode || loading ? 'bg dark-mode-bg' : 'bg'}`} />
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
                <BsMoon onClick={toggleDarkMode} size="2em" className="toggleIcon moonIcon" />
              )}
            </Grid>
          </Grid>
        </ErrorBoundary>
        <Grid item xs={12} className={`errorContainer ${error ? 'errorContainerVisible' : ''}`}>
          <h3>
            {error}
          </h3>
        </Grid>
        <Grid item xs={12}>
          <ErrorBoundary>
            {loading ? <LoadingScreen /> : <Container maxWidth="xl">{children}</Container>}
          </ErrorBoundary>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Layout;
