import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { useState, useEffect } from 'react';
import { getRandomAvatarStyles } from './../../helpers/helpers';
import Avatar from './../Avatar/Avatar';
import './header.css';

const Header = () => {
    const [random, setRandom] = useState(Math.random());
    useEffect(() => {
        const timer = setInterval(() => setRandom(Math.random), 5000);
        return () => clearInterval(timer);
    }, [])

    return (
        <Grid container>
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={12}>
                        <div className={'headerText'}>
                            Pictionary
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        {
                            [...Array(8).keys()].map((key) => <Avatar width={'50px'} height={'50px'} key={key} avatarStyles={getRandomAvatarStyles()} />)
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default Header;
