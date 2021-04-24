/* eslint-disable camelcase */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Paper, List, ListItem } from '@material-ui/core';
import Avatar from '../Avatar/Avatar';
import LobbyPlayerDialog from '../LobbyPlayerDialog/LobbyPlayerDialog';
import './lobbyUsersList.scss';

const LobbyUsersList = () => {
  const [players, creator_id, max_players] = useSelector(state => [state.game.players, state.game.creator_id, state.game.max_players]);
  const [lobbyPlayerDialog, lobbyPlayerDialogToggle] = useState(null);
  const isAdmin = useSelector(state => state.game.creator_id === state.userInfo.id);

  return (
    <Paper className="playerListContainer">
      <header id="playerListHeader">
        {`Players (${players.length}/${max_players})`}
      </header>
      <List id="playersList">
        {players.map(player => (
          <ListItem key={player.id} onClick={() => isAdmin && lobbyPlayerDialogToggle(player)}>
            <div className="playerData">
              <div className="playerAvatar">
                <Avatar avatarStyles={player.avatar} width="80px" height="80px" transparent={player.id !== creator_id} />
              </div>
              <div className="playerName">
                {player.name}
              </div>
              {player.id === creator_id ? <div className="playerAdmin">Admin</div> : ''}
            </div>
          </ListItem>
        ))}
      </List>
      <LobbyPlayerDialog player={lobbyPlayerDialog} closeDialog={() => lobbyPlayerDialogToggle(null)} />
    </Paper>
  );
};

export default LobbyUsersList;
