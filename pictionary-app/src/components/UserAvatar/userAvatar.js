import React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from '../Avatar/Avatar';
import { CHANGE_AVATAR } from '../../constants/actionTypes';
import { getRandomAvatarStyles } from '../../helpers/helpers';

const UserAvatar = ({ random }) => {
  const avatarStyles = useSelector(state => state.userInfo.avatar);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: CHANGE_AVATAR,
      payload: getRandomAvatarStyles()
    });
  }, [dispatch, random]);

  return (
    <div>
      <Avatar avatarStyles={avatarStyles} width="150px" height="150px" />
    </div>
  );
};

export default UserAvatar;
