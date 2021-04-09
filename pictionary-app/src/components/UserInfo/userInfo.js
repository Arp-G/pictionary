import React from 'react';
import { Container, TextField, ButtonGroup, Button } from '@material-ui/core';
import RandomAvatar from '../randomAvatar/randomAvatar';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { FaUserEdit, FaPlay } from 'react-icons/fa';
import { BsHouseFill } from 'react-icons/bs';
import { useState } from 'react';
import "./userInfo.css";

const UserInfo = () => {

    const [random, setRandom] = useState(Math.random());

    return (
        <Container>
            <TextField
                label="Name"
                placeholder="Your name here"
                fullWidth={true}
                variant="outlined"
            />
            <div>
                <GiPerspectiveDiceSixFacesRandom
                    size={'1.5em'}
                    className={'randomAvatarIcon'}
                    onClick={() => setRandom(Math.random())}
                />
                <FaUserEdit
                    size={'1.2em'}
                    className={'avatarSettingsIcon'}
                    onClick={() => setRandom(Math.random())}
                />
                <RandomAvatar random={random} />
                <ButtonGroup variant={'contained'} fullWidth={true} style={{ marginTop: '15px' }}>
                    <Button startIcon={<FaPlay />} style={{ backgroundColor: '#228b22', color: 'white' }}> Play ! </Button>
                    <Button startIcon={<BsHouseFill />} color='primary'> Create Private Room </Button>
                </ButtonGroup>
            </div>
        </Container>
    );
}

export default UserInfo;
