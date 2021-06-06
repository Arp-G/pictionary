import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Paper } from '@material-ui/core';
import HomeHeader from '../../components/HomeHeader/HomeHeader';
import UserInfo from '../../components/UserInfo/userInfo';
import HowToPlay from '../../components/HowToPlay/howToPlay';
import About from '../../components/About/about';
import { CLEAR_SOCKET, RESET_GAME_STATE } from '../../constants/actionTypes';
import './home.scoped.scss';

const Home = () => {
  const dispatch = useDispatch();

  // Clear and disconnect exisiting socket or channels if any
  useEffect(() => {
    dispatch({ type: CLEAR_SOCKET });
    dispatch({ type: RESET_GAME_STATE });
  }, []);

  return (
    <Container maxWidth="sm" className="homeContainer">
      <Paper className="wrapped-paper header">
        <HomeHeader />
      </Paper>
      <Paper className="wrapped-paper">
        <UserInfo />
      </Paper>
      <Paper className="wrapped-paper">
        <HowToPlay />
        <About />
      </Paper>
    </Container>
  );
};

export default Home;
