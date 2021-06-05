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

export const randomIndex = (array) => {
  const randomNumber = array.reduce((index, sum) => sum + index) % array.length;
  return array[randomNumber];
};

export const loadCanvasData = (data, callback) => {
  const img = new Image();
  img.src = data;
  img.onload = () => callback(img);
};

// I am too lazy to write this and don't want to include a heavy library like
// moment js so I copied this from https://stackoverflow.com/questions/3177836/how-to-format-time-since-xxx-e-g-4-minutes-ago-similar-to-stack-exchange-site
export const humanizeTime = (seconds) => {
  let interval = seconds / 31536000;

  if (interval > 1) {
    return `${Math.floor(interval)} years`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} months`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)} days`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} hours`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} minutes`;
  }
  return `${Math.floor(seconds)} seconds`;
};

export const timeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  return humanizeTime(seconds);
};
