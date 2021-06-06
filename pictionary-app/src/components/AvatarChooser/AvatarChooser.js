import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Paper, Grid, MenuItem, Select, FormGroup, FormControlLabel, FormControl, Box } from '@material-ui/core';
import { AiFillCloseCircle } from 'react-icons/ai';
import Avatar from '../Avatar/Avatar';
import AVATAR_STYLES from '../../constants/avatarStyles';
import { CHANGE_AVATAR } from '../../constants/actionTypes';
import { getInputlabel } from '../../helpers/helpers';
import './avatarChooser.scss';

const AvatarChooser = ({ closeModal }) => {
  const dispatch = useDispatch();
  const avatar = useSelector(state => state.userInfo.avatar);
  const darkMode = useSelector(state => state.settings.darkMode);

  return (
    <Paper className={`${darkMode && 'darkMode'} avatarChooserWrapper`}>
      <Grid container>
        <Grid item xs={12}>
          <Box className="modalCloseButton">
            <AiFillCloseCircle onClick={closeModal} />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box className="avatarChooserHeader"> Customise your avatar </Box>
          <Avatar avatarStyles={avatar} height="500px" />
        </Grid>
        <Grid item xs={6}>
          <FormGroup>
            {Object.entries(AVATAR_STYLES).map(([avatarStyle, values]) => {
              const label = getInputlabel(avatarStyle);
              return (
                <Box m={1} className="avatarChooserFormItem">
                  <FormControlLabel
                    control={(
                      <FormControl margin="dense">
                        <Select
                          value={avatar[avatarStyle]}
                          onChange={(event) => {
                            avatar[avatarStyle] = event.target.value;
                            dispatch({
                              type: CHANGE_AVATAR,
                              payload: avatar
                            });
                          }}
                          style={{ marginLeft: '20px' }}
                        >
                          {values.map(value => (
                            <MenuItem value={value}>{getInputlabel(value)}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    labelPlacement="start"
                    label={label}
                  />
                </Box>
              );
            })}
          </FormGroup>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AvatarChooser;
