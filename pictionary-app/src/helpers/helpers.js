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
