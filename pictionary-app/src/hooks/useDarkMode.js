import { useDispatch, useSelector } from 'react-redux';
import { TOGGLE_DARK_MODE } from '../constants/actionTypes';

export default () => {
  const dispatch = useDispatch();
  const darkMode = useSelector(state => state.settings.darkMode);

  const saveTheme = () => {
    window.localStorage.setItem('userTheme', !darkMode);
    dispatch({ type: TOGGLE_DARK_MODE });
  };

  return [darkMode, saveTheme];
};
