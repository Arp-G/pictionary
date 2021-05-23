/* eslint-disable camelcase */
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItem, Paper, makeStyles } from '@material-ui/core';
import { HANDLE_SEND_MESSAGE } from '../../constants/actionTypes';
import usePrevious from '../../hooks/usePrevious';
import useAudio from '../../hooks/useAudio';
import correctGuessSfx from '../../sounds/correct_guess.mp3';
import newMessageSfx from '../../sounds/new_message.mp3';
import './GameChat.scss';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    maxHeight: '62vh'
  }
});

const GameChat = () => {
  const classes = useStyles();
  const [currentMessage, setCurrentMessage] = useState('');
  const dispatch = useDispatch();
  const [messages, userId, userName, playerNames] = useSelector((state) => {
    const names = state.game.players.reduce((result, player) => {
      // eslint-disable-next-line no-param-reassign
      result[player.id] = player.name;
      return result;
    }, {});
    return [state.gamePlay.messages, state.userInfo.id, state.userInfo.name, names];
  });
  const chatListContainerRef = useRef(null);
  const handleSendMessage = (event) => {
    // On press enter
    if (event.keyCode === 13) {
      dispatch({ type: HANDLE_SEND_MESSAGE, payload: currentMessage.substr(0, 1000) });
      setCurrentMessage('');
    }
  };

  const playCorrectGuessAudio = useAudio(correctGuessSfx);
  const playNewMessageAudio = useAudio(newMessageSfx);
  const previousMessagesCount = usePrevious(messages.length);

  useEffect(() => {
    if (chatListContainerRef) chatListContainerRef.current.scrollTop = chatListContainerRef.current.scrollHeight;

    if (messages.length > 0 && previousMessagesCount !== messages.length) {
      if (messages[messages.length - 1].type === 'correct_guess') playCorrectGuessAudio();
      else playNewMessageAudio();
    }
  });

  return (
    <>
      <Paper className={classes.root}>
        <div className="chatListContainer" ref={chatListContainerRef}>
          <List>
            {messages.map(({ id, type, sender_id, message }) => {
              const name = playerNames[sender_id] || 'Anonymous';

              if (type === 'correct_guess' && sender_id !== userId) {
                // eslint-disable-next-line no-param-reassign
                message = `${userName} has guessed the correct answer!`;
              }

              if (type === 'too_close_guess' && sender_id === userId) {
                // eslint-disable-next-line no-param-reassign
                message = `${message} was very close`;
              } else if (type === 'too_close_guess') {
                // eslint-disable-next-line no-param-reassign
                type = 'wrong_Guess';
              }

              return (
                <ListItem
                  key={id}
                  disableGutters={true}
                  dense={true}
                  component="div"
                >
                  <div className={`chatItemContainer chat_${type}`}>
                    <div className="chatItemName">
                      {name}
                    </div>
                    <div className="chatItemContent">
                      {message}
                    </div>
                  </div>
                </ListItem>
              );
            })}
          </List>
        </div>
      </Paper>
      <div className="chatInput">
        <input
          type="text"
          placeholder="Type you guess here.."
          value={currentMessage}
          onKeyDown={handleSendMessage}
          onChange={event => setCurrentMessage(event.target.value)}
        />
      </div>
    </>
  );
};

export default GameChat;
