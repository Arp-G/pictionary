/* eslint-disable react/no-array-index-key */
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { REVEAL_MORE_CURRENT_WORD } from '../../constants/actionTypes';
import './GameWordBox.scoped.scss';

const GameWordBox = ({ elapsedTime }) => {
  const [
    drawTime,
    currentWord,
    currentWordRevealList,
    drawerId
  ] = useSelector(state => [
    state.game.time,
    state.gamePlay.currentWord,
    state.gamePlay.currentWordRevealList,
    state.gamePlay.drawerId
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
      // Don't reveal more word if its guessed
      if (!drawerId) {
        clearInterval(intervalTimer);
        return;
      }

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
