import React from 'react';
import { Container, TextField, ButtonGroup, Button, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import UserAvatar from '../UserAvatar/userAvatar';
import AvatarChooser from '../AvatarChooser/AvatarChooser';
import { CHANGE_NAME } from '../../constants/actionTypes';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { FaUserEdit, FaPlay } from 'react-icons/fa';
import { BsHouseFill } from 'react-icons/bs';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import "./userInfo.css";

const useStyles = makeStyles(theme => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

const UserInfo = () => {
    const classes = useStyles();
    const [random, setRandom] = useState(1);
    const [showModal, setModal] = useState(false);
    const closeModal = () => setModal(false);
    const dispatch = useDispatch();
    const name = useSelector(state => state.userInfo.name)

    return (
        <Container>
            <TextField
                label='Name'
                placeholder='Your name here'
                fullWidth={true}
                variant='outlined'
                value={name}
                onChange={(event) => dispatch({ type: CHANGE_NAME, payload: event.target.value })}
            />
            <div>
                <GiPerspectiveDiceSixFacesRandom
                    size={'1.5em'}
                    className={'userAvatarIcon'}
                    onClick={() => setRandom(Math.random())}
                />
                <FaUserEdit
                    size={'1.2em'}
                    className={'avatarSettingsIcon'}
                    onClick={() => setModal(true)}
                />
                <UserAvatar random={random} />
                <ButtonGroup variant={'contained'} fullWidth={true} style={{ marginTop: '15px' }}>
                    <Button startIcon={<FaPlay />} style={{ backgroundColor: '#228b22', color: 'white' }}> Play ! </Button>
                    <Button startIcon={<BsHouseFill />} color='primary'> Create Private Room </Button>
                </ButtonGroup>
                <Modal
                    open={showModal}
                    onClose={closeModal}
                    className={classes.modal}
                    onEscapeKeyDown={closeModal} // NOT WORKING
                >
                    <AvatarChooser closeModal={closeModal} />
                </Modal>
            </div>
        </Container>
    );
}

export default UserInfo;
