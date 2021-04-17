import React from 'react';
import { useSelector } from 'react-redux';
import { Paper, List, ListItem } from '@material-ui/core';
import Avatar from '../Avatar/Avatar';
import './lobbyUsersList.scss';

const LobbyUsersList = () => {
  const [players, creatorId] = useSelector(state => [state.game.players, state.game.creatorId]);
  return (
    <Paper className="playerListContainer">
      <header id="playerListHeader"> Players </header>
      <List id="playersList">
        {players.map(player => (
          <ListItem key={player.id}>
            <div className="playerData">
              <div className="playerAvatar">
                <Avatar avatarStyles={player.avatar} width="80px" height="80px" transparent={player.id !== creatorId} />
              </div>
              <div className="playerName">
                {player.name}
              </div>
              {player.id === creatorId ? <div className="playerAdmin">Admin</div> : ''}
            </div>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default LobbyUsersList;
