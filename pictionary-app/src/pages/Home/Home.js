/* eslint-disable max-len */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Paper, Accordion, AccordionSummary, AccordionDetails, withStyles } from '@material-ui/core';
import HomeHeader from '../../components/HomeHeader/HomeHeader';
import UserInfo from '../../components/UserInfo/userInfo';
import { CLEAR_SOCKET, RESET_GAME_STATE } from '../../constants/actionTypes';
import './home.scoped.scss';

const StyledAccordionSummary = withStyles({ content: { flexGrow: 0 } })(AccordionSummary);
const StyledAccordionDetails = withStyles({ root: { justifyContent: 'center' } })(AccordionDetails);

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
      <Paper className="wrapped-paper user-info-wrapper">
        <UserInfo />
      </Paper>
      <div className="info-wrapper">
        <Accordion>
          <StyledAccordionSummary>
            How to play
          </StyledAccordionSummary>
          <AccordionDetails>
            <div className="info-text">
              <strong>Pictionary</strong> is free multipleyer drawing and guessing game.
              One game consists of a few rounds in which every round someone has to draw their chosen word and others have to guess it to gain points!
              <p>
                When its your turn to draw, you will have to choose a word and draw that word, alternatively when somebody else is drawing you have to type your guess into the chat to gain points, be quick, the
                earlier you guess a word the more points you get!
              </p>
              <p>
                The person with the most points at the end of game will then be crowned as the winner!
              </p>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <StyledAccordionSummary>
            About
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <div className="info-text">
              <p> Know more about this project <a href="https://github.com/Arp-G/pictionary" target="blank"><strong>here.</strong></a> </p>
              <p> Found a bug or want to request a feature? Create an issue <a href="https://github.com/Arp-G/pictionary/issues/new" target="blank"><strong>here.</strong></a> </p>
            </div>
          </StyledAccordionDetails>
        </Accordion>

      </div>
    </Container>
  );
};

export default Home;
