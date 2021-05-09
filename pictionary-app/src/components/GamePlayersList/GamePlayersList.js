import React from 'react';
import { useSelector } from 'react-redux';
import { List, ListItem } from '@material-ui/core';
import { FaPencilAlt } from 'react-icons/fa';
import withPlayerCountChangeSfx from '../../hocs/withPlayerCountChangeSfx';
import Avatar from '../Avatar/Avatar';
import './GamePlayersList.scss';

const GamePlayersList = () => {
  const players = useSelector(state => state.game.players.map((player) => {
    // eslint-disable-next-line no-param-reassign
    player.score = state.gamePlay.scores[player.id] || 0;
    return player;
  }));

  const drawerId = useSelector(state => state.gamePlay.drawerId);
  return (
    <div className="gamePlayerListContainer">
      <List>
        {players.map((player, index) => (
          <ListItem
            key={player.id}
            disableGutters={true}
            dense={true}
            component="div"
          >
            <div className={index % 2 === 0 ? 'gamePlayerListItem' : 'gamePlayerListItemGrey'}>
              <div className="gamePlayerRank">{`#${index + 1}`}</div>
              <div className="gamePlayerDetails">
                <div className="gamePlayerName">{player.name}</div>
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
