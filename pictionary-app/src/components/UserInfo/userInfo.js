import React from 'react';
import { Card } from '@material-ui/core';
import RandomAvatar from '../randomAvatar/randomAvatar';

const UserInfo = () => {
    return (
        <div>
            <Card>
                This is some text within a card body.
                <RandomAvatar />
            </Card>
        </div>
    );
}

export default UserInfo;
