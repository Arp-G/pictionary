/* eslint-disable camelcase */
import React from 'react';
import { List, ListItem, TextField } from '@material-ui/core';
import './GameChat.scss';

const dummyChats = new Array(20).fill({
  name: 'Arp',
  message: "Santa clause"
});

const GameChat = () => (
  <div className="chatContainer">
    <List>
      {dummyChats.map(({ name, message }, index) => (
        <ListItem
          key={index}
          disableGutters={true}
          dense={true}
          component="div"
        >
          <div className="chatItemContainer">
            <div className="chatItemName">
              {name}
            </div>
            <div className="chatItemContent">
              {message}
            </div>
          </div>
        </ListItem>
      ))}
    </List>
    <div className="chatInput">
      <input type="text" placeholder="Type you guess here.." />
    </div>
  </div>
);

export default GameChat;
