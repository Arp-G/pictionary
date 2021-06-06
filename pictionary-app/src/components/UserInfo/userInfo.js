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
import {
  CHANGE_NAME,
  HANDLE_CREATE_USER_SESSION,
  HANDLE_CREATE_GAME_FLOW,
  HANDLE_JOIN_GAME_FLOW,
  HANDLE_FIND_GAME_FLOW
} from '../../constants/actionTypes';
import './userInfo.scoped.scss';

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
  const gameToJoinId = useSelector(state => state.settings.gameToJoinId);

  const createAndJoinGame = () => {
    if (name !== '') dispatch({ type: HANDLE_CREATE_USER_SESSION, payload: { name, avatar }, flowType: HANDLE_CREATE_GAME_FLOW });
    else setError(true);
  };

  const joinExistingGame = () => {
    if (name !== '') dispatch({ type: HANDLE_CREATE_USER_SESSION, payload: { name, avatar }, flowType: HANDLE_JOIN_GAME_FLOW, gameToJoinId });
    else setError(true);
  };

  const findNewGame = () => {
    if (name !== '') dispatch({ type: HANDLE_CREATE_USER_SESSION, payload: { name, avatar }, flowType: HANDLE_FIND_GAME_FLOW });
    else setError(true);
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
          dispatch({ type: CHANGE_NAME, payload: event.target.value?.substr(0, 30) });
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
            onClick={() => (gameToJoinId ? joinExistingGame() : findNewGame())}
          >
            {gameToJoinId ? 'Join Game !' : 'Play !'}
          </Button>
          <Button
            startIcon={<BsHouseFill />}
            color="primary"
            onClick={createAndJoinGame}
          >
            Create Game
          </Button>
        </ButtonGroup>
        <Modal
          open={showModal}
          onClose={closeModal}
          className={classes.modal}
          onEscapeKeyDown={closeModal} // NOT WORKING
        >
          <div>
            <AvatarChooser closeModal={closeModal} />
          </div>
        </Modal>
      </Box>
    </Container>
  );
};

export default UserInfo;
