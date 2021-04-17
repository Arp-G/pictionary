import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useSetRandomAvatar from '../../hooks/useDidMount';
import Avatar from '../Avatar/Avatar';
import { CHANGE_AVATAR } from '../../constants/actionTypes';
import { getRandomAvatarStyles } from '../../helpers/helpers';

const UserAvatar = ({ random }) => {
  const avatarStyles = useSelector(state => state.userInfo.avatar);
  const dispatch = useDispatch();

  /*
  Custom hook "useDidMount" is used to set a random avatar to player if dependency "random" changes
  The main usage of this custom hook ensures that random avatar is not set due to dependency "random" if its the first render
  */
  useSetRandomAvatar(() => {
    dispatch({ type: CHANGE_AVATAR, payload: getRandomAvatarStyles() });
  }, [dispatch, random]);

  return (
    <div>
      <Avatar avatarStyles={avatarStyles} transparent={false} width="150px" height="150px" />
    </div>
  );
};

export default UserAvatar;
