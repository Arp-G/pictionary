import React from 'react';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { BsFillVolumeUpFill, BsFillVolumeMuteFill, BsSun, BsMoon } from 'react-icons/bs';
import { TOGGLE_SOUND, TOGGLE_DARK_MODE } from '../constants/actionTypes';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import useSound from 'use-sound';
import soundToggleSfx from '../sounds/sound.mp3'
import "./layout.css";
import { CSSTransition } from 'react-transition-group';

import { useSelector, useDispatch } from 'react-redux';

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

    const theme = createMuiTheme({
        palette: {
            type: darkMode ? "dark" : "light"
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <Grid container>
                <Grid item xs={1}>
                    <Grid item xs={12}>
                        {
                            sound
                                ? <CSSTransition in={true} timeout={200} classNames="toggle-icon">
                                    <BsFillVolumeUpFill onClick={toggleSound} size={'2em'} />
                                </CSSTransition>
                                : <CSSTransition in={true} timeout={200} classNames="toggle-icon">
                                    <BsFillVolumeMuteFill onClick={toggleSound} size={'2em'} />
                                </CSSTransition>
                        }
                    </Grid>

                    <Grid item xs={12}>
                        {
                            darkMode
                                ? <BsSun onClick={toggleDarkMode} size={'2em'} className={'toggleIcon'} />
                                : <BsMoon onClick={toggleDarkMode} size={'2em'} className={'toggleIcon'} />
                        }
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Container maxWidth='xl'>
                        {children}
                    </Container>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

export default Layout;
