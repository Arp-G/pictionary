import { useDispatch, useSelector } from 'react-redux';
import useAudio from './useAudio';
import soundToggleSfx from '../sounds/sound.mp3';
import { TOGGLE_SOUND } from '../constants/actionTypes';

export default () => {
  const dispatch = useDispatch();
  const sound = useSelector(state => state.settings.sound);
  const playSoundSfx = useAudio(soundToggleSfx, true);

  const saveSound = () => {
    window.localStorage.setItem('userSound', !sound);
    dispatch({ type: TOGGLE_SOUND });
    playSoundSfx();
  };

  return [sound, saveSound];
};
