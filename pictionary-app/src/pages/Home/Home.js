import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Paper } from '@material-ui/core';
import Header from '../../components/Header/header';
import UserInfo from '../../components/UserInfo/userInfo';
import HowToPlay from '../../components/HowToPlay/howToPlay';
import About from '../../components/About/about';
import { CLEAR_SOCKET } from '../../constants/actionTypes';
import './home.scss';

const Home = () => {
  const dispatch = useDispatch();

  // Clear and disconnect exisiting socket or channels if any
  useEffect(() => dispatch({ type: CLEAR_SOCKET }), []);

  return (
    <Container maxWidth="sm" className="homeContainer">
      <Paper className="wrapped-paper header">
        <Header />
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
