import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { REVEAL_MORE_CURRENT_WORD } from '../../constants/actionTypes';
import './GameWordBox.scss';

const GameWordBox = () => {
  const [
    drawTime,
    currentWord,
    currentWordRevealList
  ] = useSelector(state => [state.game.time, state.gamePlay.currentWord, state.gamePlay.currentWordRevealList, state.gamePlay.drawerId]);
  const isDrawer = useSelector(state => state.gamePlay.drawerId === state.userInfo.id);

  const dispatch = useDispatch();

  useEffect(() => {
    const intervalPeriod = drawTime / 5;
    const intervalTimer = setInterval(() => {
      console.log(`REVEALING FOR ${currentWord}`);
      dispatch({ type: REVEAL_MORE_CURRENT_WORD });
    }, intervalPeriod * 1000);

    return () => clearInterval(intervalTimer);
  }, []);

  return (
    <div className="alphabetGuessContainer">
      {
        isDrawer
          ? currentWord
            .split('')
            .map(alphabet => (alphabet === ' ' ? <div className="alphabetGuessSpace" /> : <div className="alphabetGuess">{alphabet}</div>))
          : currentWord.split('')
            .map((alphabet, index) => {
              let char;
              if (currentWordRevealList[index] && alphabet !== '') {
                char = <div className="alphabetGuess">{alphabet}</div>;
              } else if (alphabet === ' ') { char = <div className="alphabetGuessSpace" />; } else { char = <div className="alphabetGuess">&#160;&#160;</div>; }
              return char;
            })
      }
    </div>
  );
};

export default GameWordBox;
