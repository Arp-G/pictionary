import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BsFillVolumeUpFill, BsFillVolumeMuteFill } from 'react-icons/bs';
import { TOGGLE_SOUND } from '../constants/actionTypes';
import useSound from 'use-sound';
import soundToggleSfx from '../sounds/sound.mp3'
import "./layout.css";

import { useSelector, useDispatch } from 'react-redux';

const Layout = ({ children }) => {

    const sound = useSelector(state => state.settings.sound);
    const dispatch = useDispatch();
    const [playSoundSfx] = useSound(soundToggleSfx, { volume: 0.3 });

    const toggleSound = () => {
        playSoundSfx();
        return dispatch({ type: TOGGLE_SOUND })
    };

    return (
        <Container fluid>
            <Row>
                <Col md={1} className={"test"}>
                    {
                        sound
                            ? <BsFillVolumeUpFill onClick={toggleSound} size={'2em'} />
                            : <BsFillVolumeMuteFill onClick={toggleSound} size={'2em'} />
                    }

                </Col>
            </Row>
            <Row>
                <Col md={4} className={"test"}>Empty</Col>
                <Col md={4} className={"test"}>{children}</Col>
            </Row>
        </Container>
    );
}

export default Layout;
