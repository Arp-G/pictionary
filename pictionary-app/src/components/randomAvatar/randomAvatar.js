import React from 'react';
import Avatar from 'avataaars';
import { AVATAR_STYLES } from '@constants/avatarStyles';

const RandomAvatar = () => {
    const getRandomStyle = (styles) => styles[Math.floor(Math.random() * styles.length)];
    const randomisedStyles = {};
    Object.keys(AVATAR_STYLES).forEach(key => randomisedStyles[key] = getRandomStyle(AVATAR_STYLES[key]));
    console.log(randomisedStyles)

    return (
        <div>
            <Avatar
                style={{ width: '100px', height: '100px' }}
                avatarStyle='Circle'
                topType={randomisedStyles['top']}
                accessoriesType={randomisedStyles['accessories']}
                hairColor={randomisedStyles['hairColor']}
                facialHairType={randomisedStyles['facialHairType']}
                facialHairColor={randomisedStyles['facialHairColor']}
                clotheType={randomisedStyles['clotheType']}
                clotheColor={randomisedStyles['clotheColor']}
                eyeType={randomisedStyles['eyeType']}
                eyebrowType={randomisedStyles['eyeBrowType']}
                mouthType={randomisedStyles['mouth']}
                skinColor={randomisedStyles['skinColor']}
            />
        </div>
    );
}

export default RandomAvatar;
