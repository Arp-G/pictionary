import React from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, TextField, Box, ButtonGroup, Button, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { FaUserEdit, FaPlay } from 'react-icons/fa';
import { BsHouseFill } from 'react-icons/bs';
import UserAvatar from '../UserAvatar/userAvatar';
import AvatarChooser from '../AvatarChooser/AvatarChooser';
import { CHANGE_NAME, CREATE_SESSION } from '../../constants/actionTypes';
import './userInfo.scss';

const useStyles = makeStyles(() => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

const UserInfo = () => {
  const classes = useStyles();
  const [random, setRandom] = useState(1);
  const [error, setError] = useState(false);
  const [showModal, setModal] = useState(false);
  const closeModal = () => setModal(false);
  const dispatch = useDispatch();
  const name = useSelector(state => state.userInfo.name);
  const avatar = useSelector(state => state.userInfo.avatar);
  const createUserSession = () => {
    if (name === '') {
      setError(true);
      return;
    }

    dispatch({ type: CREATE_SESSION, payload: { name, avatar } });
  };

  return (
    <Container>
      <TextField
        required
        label="Name"
        placeholder="Your name here"
        fullWidth={true}
        variant="outlined"
        value={name}
        error={error}
        helperText={error ? 'Name is required!' : ''}
        onChange={(event) => {
          if (event.target.value !== '') setError(false);
          dispatch({ type: CHANGE_NAME, payload: event.target.value });
        }}
      />
      <Box>
        <GiPerspectiveDiceSixFacesRandom size="1.5em" className="userAvatarIcon" onClick={() => setRandom(Math.random())} />
        <FaUserEdit size="1.2em" className="avatarSettingsIcon" onClick={() => setModal(true)} />
        <UserAvatar random={random} />
        <ButtonGroup variant="contained" fullWidth={true} style={{ marginTop: '15px' }}>
          <Button
            startIcon={<FaPlay />}
            style={{ backgroundColor: '#228b22', color: 'white' }}
            onClick={createUserSession}
          >
            Play !
          </Button>
          <Button
            startIcon={<BsHouseFill />}
            color="primary"
            onClick={createUserSession}
          >
            Create Private Room
          </Button>
        </ButtonGroup>
        <Modal
          open={showModal}
          onClose={closeModal}
          className={classes.modal}
          onEscapeKeyDown={closeModal} // NOT WORKING
        >
          <AvatarChooser closeModal={closeModal} />
        </Modal>
      </Box>
    </Container>
  );
};

export default UserInfo;
