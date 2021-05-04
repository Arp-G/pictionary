import { useSelector } from 'react-redux';
import useSound from 'use-sound';

export default (audioPath) => {
  const soundEnabled = useSelector(state => state.settings.sound);
  const [playSoundSfx] = useSound(audioPath, { volume: 0.3 });

  const playAudio = () => {
    if (soundEnabled) playSoundSfx();
  };

  return playAudio;
};
