/* eslint-disable no-param-reassign */
import React from 'react';
import { useSelector } from 'react-redux';
import { List, ListItem } from '@material-ui/core';
import { FaPencilAlt } from 'react-icons/fa';
import withPlayerCountChangeSfx from '../../hocs/withPlayerCountChangeSfx';
import Avatar from '../Avatar/Avatar';
import './GamePlayersList.scoped.scss';

const GamePlayersList = () => {
  const players = useSelector(state => state.game.players.map((player) => {
    player.score = state.gamePlay.scores[player.id] || 0;
    player.guessed = !!state.gamePlay.guessers.find(playerId => playerId === player.id);
    return player;
  }));

  const [drawerId, currentUserId] = useSelector(state => [state.gamePlay.drawerId, state.userInfo.id]);
  return (
    <div className="gamePlayerListContainer">
      <List>
        {players.sort((player1, player2) => player2.score - player1.score).map((player, index) => (
          <ListItem
            key={player.id}
            disableGutters={true}
            dense={true}
            component="div"
          >
            <div className={index % 2 === 0 ? 'gamePlayerListItem' : 'gamePlayerListItemGrey'}>
              <div className="gamePlayerRank">{`#${index + 1}`}</div>
              <div className={`gamePlayerDetails ${player.guessed ? 'playerGuessed' : ''}`}>
                <div
                  className={`gamePlayerName ${player.id === currentUserId && 'self'}`}
                >
                  {`${player.name} ${player.id === currentUserId ? '(You)' : ''}`}
                </div>
                <div className="gamePlayerScore">{`Points: ${player.score}`}</div>
              </div>
              <div className="drawIcon">
                {player.id === drawerId && <FaPencilAlt />}
              </div>
              <div className="gamePlayerAvatar">
                <Avatar avatarStyles={player.avatar} width="45px" height="45px" transparent={true} />
              </div>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default withPlayerCountChangeSfx(GamePlayersList);
