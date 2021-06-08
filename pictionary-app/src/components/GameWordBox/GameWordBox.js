/* eslint-disable react/no-array-index-key */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { REVEAL_MORE_CURRENT_WORD } from '../../constants/actionTypes';
import './GameWordBox.scoped.scss';

const GameWordBox = ({ elapsedTime, setRevealInterval, clearRevealInterval }) => {
  const [
    drawTime,
    currentWord,
    currentWordRevealList
  ] = useSelector(state => [
    state.game.time,
    state.gamePlay.currentWord,
    state.gamePlay.currentWordRevealList
  ]);
  const isDrawer = useSelector(state => state.gamePlay.drawerId === state.userInfo.id);

  const dispatch = useDispatch();

  useEffect(() => {
    const intervalPeriod = drawTime / 5;

    if (elapsedTime) {
      const lettersToReveal = Math.ceil(elapsedTime / intervalPeriod);
      for (let i = 1; i <= lettersToReveal; i += 1) { dispatch({ type: REVEAL_MORE_CURRENT_WORD }); }
    }

    const intervalTimer = setInterval(() => {
      dispatch({ type: REVEAL_MORE_CURRENT_WORD });
    }, intervalPeriod * 1000);

    setRevealInterval(intervalTimer);

    return () => clearRevealInterval();
  }, []);

  return (
    <div className="alphabetGuessContainer">
      {
        isDrawer
          ? currentWord
            .split('')
            .map((alphabet, index) => (alphabet === ' '
              ? <div className="alphabetGuessSpace" key={index} />
              : <div className="alphabetGuess" key={index}>{alphabet}</div>))
          : currentWord.split('')
            .map((alphabet, index) => {
              let char;
              if (currentWordRevealList[index] && alphabet !== '') {
                char = <div className="alphabetGuess" key={index}>{alphabet}</div>;
              } else if (alphabet === ' ') {
                char = <div className="alphabetGuessSpace" key={index} />;
              } else { char = <div className="alphabetGuess" key={index}>&#160;&#160;</div>; }
              return char;
            })
      }
    </div>
  );
};

export default GameWordBox;
