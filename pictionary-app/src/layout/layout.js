import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import { Grid, Container, Snackbar, Slide } from '@material-ui/core';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { BsFillVolumeUpFill, BsFillVolumeMuteFill, BsSun, BsMoon } from 'react-icons/bs';
import { AiFillCloseCircle } from 'react-icons/ai';
import LoadingScreen from '../pages/loading/loading';
import { CLEAR_ALERT } from '../constants/actionTypes';
import ErrorBoundary from '../misc/errorBoundary';
import useDarkMode from '../hooks/useDarkMode';
import useSfx from '../hooks/useSfx';
import './layout.scss';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { alertType, msg } = useSelector(state => state.settings.alert);
  const loading = useSelector(state => state.settings.loading);
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sound, toggleSound] = useSfx();
  const theme = createMuiTheme(
    {
      palette: {
        primary: { main: '#0080FF' },
        type: darkMode ? 'dark' : 'light'
      }
    }
  );

  let alertColor;
  switch (alertType) {
    case 'error':
      alertColor = '#f44336';
      break;
    case 'success':
      alertColor = '#4caf50';
      break;
    case 'info':
      alertColor = '#2196f3';
      break;
    default:
      alertColor = '#2196f3';
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={`${darkMode || loading ? 'bg dark-mode-bg' : 'bg'}`} />
      <Grid container className={`main-wrapper-container ${darkMode && 'darkMode'}`}>
        <ErrorBoundary>
          <Grid item xs={12}>
            <Grid item xs={6}>
              <Grid container>
                <Grid item xs={1}>
                  {sound ? (
                    <BsFillVolumeUpFill onClick={toggleSound} size="2em" className="toggleIcon" />
                  ) : (
                    <BsFillVolumeMuteFill onClick={toggleSound} size="2em" className="toggleIcon" />
                  )}
                </Grid>
                {location.pathname !== '/' && (
                  <Grid item xs={2}>
                    <div className="pictionary-text">
                      <Link to="/">Pictionary</Link>
                    </div>
                  </Grid>
                )}
              </Grid>
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
        <Grid item xs={12}>
          <ErrorBoundary>
            {loading ? <LoadingScreen /> : <Container maxWidth="xl">{children}</Container>}
          </ErrorBoundary>
        </Grid>
      </Grid>
      {msg
        && (
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={true}
            autoHideDuration={2000}
            onClose={() => dispatch({ type: CLEAR_ALERT })}
            message={msg}
            action={<AiFillCloseCircle onClick={() => dispatch({ type: CLEAR_ALERT })} />}
            ContentProps={{ style: { backgroundColor: alertColor } }}
            // eslint-disable-next-line react/jsx-props-no-spreading
            TransitionComponent={props => <Slide {...props} direction="up" />}
          />
        )}
    </ThemeProvider>
  );
};

export default Layout;
