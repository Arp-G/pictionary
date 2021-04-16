import { useDispatch, useSelector } from 'react-redux';
import useSound from 'use-sound';
import soundToggleSfx from '../sounds/sound.mp3';
import { TOGGLE_SOUND } from '../constants/actionTypes';

export default () => {
  const dispatch = useDispatch();
  const sound = useSelector(state => state.settings.sound);
  const [playSoundSfx] = useSound(soundToggleSfx, { volume: 0.3 });

  const saveSound = () => {
    window.localStorage.setItem('userSound', !sound);
    playSoundSfx();
    dispatch({ type: TOGGLE_SOUND });
  };

  return [sound, saveSound];
};
