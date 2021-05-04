import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAudio from '../hooks/useAudio';
import usePrevious from '../hooks/usePrevious';
import playerEnterSfx from '../sounds/player_enter.mp3';
import playerLeaveSfx from '../sounds/player_leave.mp3';

const withPlayerCountChangeSfx = WrappedComponent => (props) => {
  const playersLength = useSelector(state => state.game.players.length);
  const playPlayerEnterSfx = useAudio(playerEnterSfx);
  const playPlayerLeaverSfx = useAudio(playerLeaveSfx);

  // Custom hook to store previous player count to detect new player join or leave
  const previousUsersCount = usePrevious(playersLength);
  useEffect(() => {
    if (previousUsersCount < playersLength) playPlayerEnterSfx();
    if (previousUsersCount > playersLength) playPlayerLeaverSfx();
  }, [playersLength]);

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <WrappedComponent {...props} />
  );
};

export default withPlayerCountChangeSfx;
