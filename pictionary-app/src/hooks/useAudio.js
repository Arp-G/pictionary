import { useSelector } from 'react-redux';

export default (audioPath, force = false) => {
  const soundEnabled = useSelector(state => state.settings.sound);
  const audioElement = new Audio(audioPath);

  const playAudio = () => {
    // eslint-disable-next-line no-console
    console.log(`Playing Sound ${audioPath}`);
    if (soundEnabled || force) audioElement.play();
  };

  return playAudio;
};
