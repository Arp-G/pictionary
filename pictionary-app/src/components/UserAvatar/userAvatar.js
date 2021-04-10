import React from 'react';
import { useEffect } from 'react';
import { CHANGE_AVATAR } from '../../constants/actionTypes';
import { useSelector, useDispatch } from 'react-redux';
import { getRandomAvatarStyles } from './../../helpers/helpers';
import Avatar from './../Avatar/Avatar';

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
        <div> <Avatar avatarStyles={avatarStyles}  width={'150px'} height={'150px'} /> </div>
    );
}

export default UserAvatar;
