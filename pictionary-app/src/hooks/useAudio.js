import { useSelector } from 'react-redux';

export default (audioPath, force = false) => {
  const soundEnabled = useSelector(state => state.settings.sound);
  // console.log("REFRESHING CUSOTM HOOK " + soundEnabled);
  const audioElement = new Audio(audioPath);

  const playAudio = () => {
    if (soundEnabled || force) {
      // eslint-disable-next-line no-console
      console.log(`Playing Sound ${audioPath}`);
      audioElement.play();
    }
  };

  return playAudio;
};
