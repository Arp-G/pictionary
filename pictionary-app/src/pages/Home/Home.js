import React from 'react';
import { Container, Paper } from '@material-ui/core';
import Header from '../../components/Header/header';
import UserInfo from '../../components/UserInfo/userInfo';
import HowToPlay from '../../components/HowToPlay/howToPlay';
import About from '../../components/About/about';
import './home.scss';

const Home = () => (
  <Container maxWidth="sm" alignContent="center" className="homeContainer">
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

export default Home;
