import { AVATAR_STYLES } from './../constants/avatarStyles';

export const getRandomAvatarStyles = () => {
    const getRandomStyle = (styles) => styles[Math.floor(Math.random() * styles.length)];
    const randomisedStyles = {};
    Object.keys(AVATAR_STYLES).forEach(key => randomisedStyles[key] = getRandomStyle(AVATAR_STYLES[key]));
    return randomisedStyles;
}
       