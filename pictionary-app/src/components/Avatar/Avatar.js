import React from 'react';
import Avataaars from 'avataaars';

const Avatar = ({ avatarStyles, width, height }) => (
  <Avataaars
    style={{ width: width || '100%', height: height || '100%', transition: 'all .3s ease' }}
    avatarStyle="transparent"
    topType={avatarStyles.top}
    accessoriesType={avatarStyles.accessories}
    hairColor={avatarStyles.hairColor}
    facialHairType={avatarStyles.facialHairType}
    facialHairColor={avatarStyles.facialHairColor}
    clotheType={avatarStyles.clotheType}
    clotheColor={avatarStyles.clotheColor}
    eyeType={avatarStyles.eyeType}
    eyebrowType={avatarStyles.eyeBrowType}
    mouthType={avatarStyles.mouth}
    skinColor={avatarStyles.skinColor}
  />
);

export default Avatar;
