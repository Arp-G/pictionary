import React from 'react';
import { List, ListItem } from '@material-ui/core';
import { FaPencilAlt } from 'react-icons/fa';
import withPlayerCountChangeSfx from '../../hocs/withPlayerCountChangeSfx';
import Avatar from '../Avatar/Avatar';
import './GamePlayersList.scss';

const GamePlayersList = () => {
  // const [
  //   selfId,
  //   players,
  //   creator_id,
  //   max_players,
  //   darkMode
  // ] = useSelector(state => [state.userInfo.id, state.game.players, state.game.creator_id, state.game.max_players, state.settings.darkMode]);

  // Dummy Data
  const players = new Array(2).fill(
    {
      id: '7d28937a-a0c8-4edf-86fb-2fafc72f42a5',
      name: 'Daisyelf Bolaaaaaaaaaaaaaaaaaaaat',
      avatar: {
        accessories: 'Wayfarers',
        clotheColor: 'Black',
        clotheType: 'ShirtVNeck',
        eyeBrowType: 'SadConcernedNatural',
        eyeType: 'WinkWacky',
        facialHairColor: 'Red',
        facialHairType: 'Blank',
        hairColor: 'BrownDark',
        mouth: 'Concerned',
        skinColor: 'Tanned',
        top: 'WinterHat4'
      }
    }
  );

  return (
    // eslint-disable-next-line react/self-closing-comp
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
