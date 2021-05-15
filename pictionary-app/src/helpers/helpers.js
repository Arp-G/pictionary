/* eslint-disable no-bitwise */
import AVATAR_STYLES from '../constants/avatarStyles';

export const getRandomAvatarStyles = () => {
  const getRandomStyle = styles => styles[Math.floor(Math.random() * styles.length)];
  const randomisedStyles = {};
  // eslint-disable-next-line no-return-assign
  Object.keys(AVATAR_STYLES).forEach(key => (randomisedStyles[key] = getRandomStyle(AVATAR_STYLES[key])));
  return randomisedStyles;
};

export const getInputlabel = (input) => {
  const label = input.split(/(?=[A-Z])/).join(' ');
  return label[0].toUpperCase() + label.slice(1);
};

export const getTokenFromLocalStorage = () => window.localStorage.getItem('token');

export const getRandomItem = list => list[Math.floor(Math.random() * list.length)];

export const clipboardCopy = (text) => {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

export const range = (startAt = 1, size = 10, step = 1) => {
  const arr = [];
  for (let i = startAt; i <= size; i += step) {
    arr.push(i);
  }

  return arr;
};

export const getWinnerPosition = (position) => {
  switch (position) {
    case 1: return 'Ist';
    case 2: return '2nd';
    case 3: return '3rd';
    default: return '';
  }
};

// Hash a string taken from: https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
// function hashCode(str) {
//   let hash = 0; let i; let chr;
//   if (str.length === 0) return hash;
//   // eslint-disable-next-line no-plusplus
//   for (i = 0; i < str.length; i++) {
//     chr = str.charCodeAt(i);
//     hash = ((hash << 5) - hash) + chr;
//     hash |= 0; // Convert to 32bit integer
//   }
//   return hash;
// }

export const randomIndex = (array) => {
  const randomNumber = array.reduce((index, sum) => sum + index) % array.length;
  return array[randomNumber];
};
