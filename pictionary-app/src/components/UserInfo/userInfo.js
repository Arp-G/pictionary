import React from 'react';
import { Card } from 'react-bootstrap';
import RandomAvatar from '../randomAvatar/randomAvatar';

const UserInfo = () => {
    return (
        <div>
            <Card>
                <Card.Body>
                    This is some text within a card body.
                    <RandomAvatar />
                    </Card.Body>
            </Card>
        </div>
    );
}

export default UserInfo;
