/* eslint-disable camelcase */
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Paper, List, ListItem } from '@material-ui/core';
import Avatar from '../Avatar/Avatar';
import LobbyPlayerDialog from '../LobbyPlayerDialog/LobbyPlayerDialog';
import './LobbyPlayersList.scss';
import withPlayerCountChangeSfx from '../../hocs/withPlayerCountChangeSfx';

const LobbyPlayersList = () => {
  const [
    selfId,
    players,
    creator_id,
    max_players,
    darkMode
  ] = useSelector(state => [state.userInfo.id, state.game.players, state.game.creator_id, state.game.max_players, state.settings.darkMode]);
  const [lobbyPlayerDialog, lobbyPlayerDialogToggle] = useState(false);
  const [lobbySelectedPlayer, lobbyChangeSelectedPlayer] = useState(null);
  const isAdmin = useSelector(state => state.game.creator_id === state.userInfo.id);

  const handlePlayerClick = (player) => {
    lobbyPlayerDialogToggle(true);
    lobbyChangeSelectedPlayer(player);
  };

  return (
    <Paper className="playerListContainer">
      <header id="playerListHeader">
        {`Players (${players.length}/${max_players})`}
        {isAdmin && <div className="adminHint"> (Click on players for additional actions) </div>}
      </header>
      <List id="playersList">
        {players.map(player => (
          <ListItem key={player.id} onClick={() => isAdmin && player.id !== creator_id && handlePlayerClick(player)}>
            <div className={`${darkMode ? 'darkPlayerData' : 'playerData'}`}>
              <div className="playerAvatar">
                <Avatar avatarStyles={player.avatar} width="80px" height="80px" transparent={player.id !== creator_id} />
              </div>
              <div className="playerName">
                {player.name}
              </div>
              {player.id === creator_id ? <div className="playerAdmin">Admin</div> : ''}
              {player.id === selfId ? <div className="playerSelf">(You)</div> : ''}
            </div>
          </ListItem>
        ))}
      </List>
      <LobbyPlayerDialog open={lobbyPlayerDialog} player={lobbySelectedPlayer} closeDialog={() => lobbyPlayerDialogToggle(false)} />
    </Paper>
  );
};

export default withPlayerCountChangeSfx(LobbyPlayersList);
