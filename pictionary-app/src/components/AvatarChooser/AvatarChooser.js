import React from 'react';
import { Paper, Grid, MenuItem, Select, FormGroup, FormControlLabel, FormControl } from '@material-ui/core';
import { AiFillCloseCircle } from 'react-icons/ai';
import { CHANGE_AVATAR } from './../../constants/actionTypes';
import { useSelector, useDispatch } from 'react-redux';
import { AVATAR_STYLES } from './../../constants/avatarStyles';
import Avatar from './../Avatar/Avatar';
import './avatarChooser.css';

const AvatarChooser = ({ closeModal }) => {
    const dispatch = useDispatch();
    const avatar = useSelector(state => state.userInfo.avatar);

    return (
        <Paper className={'avatarChooserWrapper'}>
            <Grid container >
                <Grid item xs={12} style={{ textAlign: 'right' }} > <AiFillCloseCircle onClick={closeModal} /> </Grid>
                <Grid item xs={6} style={{ paddingTop: '20%' }}> <Avatar avatarStyles={avatar} /> </Grid>
                <Grid item xs={6}>
                    <FormGroup>
                        {
                            Object.entries(AVATAR_STYLES).map(([avatarStyle, values]) => {
                                return <FormControlLabel
                                    control={
                                        <FormControl variant="outlined">
                                            <Select
                                                label={avatarStyle}
                                                value={avatar[avatarStyle]}
                                                onChange={(event) => {
                                                    avatar[avatarStyle] = event.target.value
                                                    dispatch({
                                                        type: CHANGE_AVATAR,
                                                        payload: avatar
                                                    });
                                                }}
                                            >
                                                {values.map(value => <MenuItem value={value}>{value}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    }
                                    label={avatarStyle}
                                />
                            })
                        }
                    </FormGroup>
                </Grid>
            </Grid>
        </Paper >
    );
}

export default AvatarChooser;
