import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import { useState, useEffect } from 'react';
import { getRandomAvatarStyles } from './../../helpers/helpers';
import Avatar from './../Avatar/Avatar';
import { GiNightSleep } from 'react-icons/gi';

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
                            <h1>Pictionary</h1>
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
