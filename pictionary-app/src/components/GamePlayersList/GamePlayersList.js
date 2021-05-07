import React from 'react';
import { useSelector } from 'react-redux';
import { List, ListItem } from '@material-ui/core';
import { FaPencilAlt } from 'react-icons/fa';
import withPlayerCountChangeSfx from '../../hocs/withPlayerCountChangeSfx';
import Avatar from '../Avatar/Avatar';
import './GamePlayersList.scss';

const GamePlayersList = () => {
  const players = useSelector(state => state.game.players);
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
                <div className="gamePlayerScore">{`Points: ${100}`}</div>
              </div>
              <div className="drawIcon">
                {index % 2 === 0 && <FaPencilAlt />}
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
