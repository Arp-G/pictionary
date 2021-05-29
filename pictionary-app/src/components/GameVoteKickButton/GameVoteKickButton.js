/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { push } from 'connected-react-router';
import { Button } from '@material-ui/core';
import { GiHighKick } from 'react-icons/gi';
import { ADD_ALERT } from '../../constants/actionTypes';
import { WS_VOTE_KICK_UPDATE, WS_KICK_PLAYER, WS_VOTE_TO_KICK } from '../../constants/websocketEvents';
import './GameVoteKickButton.scss';

const GameVoteKickButton = () => {
  const dispatch = useDispatch();
  const [selfId, drawerId] = useSelector(state => [state.userInfo.id, state.gamePlay.drawerId]);
  const [gameChannel, playersCount, selfVoteKick, drawerName] = useSelector(state => [
    state.settings.gameChannel,
    state.game.players.length,
    state.userInfo.id === state.gamePlay.drawerId,
    state.game.players.find(player => player.id === state.gamePlay.drawerId)?.name || 'Anonymous'
  ]);
  const [count, setVoteKickCount] = useState(0);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    gameChannel.on(WS_VOTE_KICK_UPDATE, payload => setVoteKickCount(payload.vote_count));
    gameChannel.on(WS_KICK_PLAYER, (payload) => {
      if (payload.player_id === selfId) {
        setTimeout(() => dispatch({ type: ADD_ALERT, alertType: 'info', msg: 'You were vote kicked from the game!' }), 1000);
        dispatch(push('/'));
      }
    });
    return () => {
      gameChannel.off(WS_VOTE_KICK_UPDATE);
      gameChannel.off(WS_KICK_PLAYER);
    };
  }, []);

  useEffect(() => {
    setVoteKickCount(0);
    setVoted(false);
  }, [drawerId]);

  const text = count > 0 ? `(${count}/${playersCount - 1})` : '';

  return selfVoteKick || !drawerId ? null : (
    <div className="voteToKickButtonContainer">
      <Button
        size="small"
        variant="contained"
        color={count > 0 ? 'secondary' : 'primary'}
        startIcon={<GiHighKick />}
        disabled={voted}
        onClick={() => {
          setVoted(true);
          gameChannel.push(WS_VOTE_TO_KICK, {});
        }}
        style={{ textTransform: 'none' }}
      >
        {`Vote Kick ${drawerName}${text}`}
      </Button>
    </div>
  );
};

export default GameVoteKickButton;
