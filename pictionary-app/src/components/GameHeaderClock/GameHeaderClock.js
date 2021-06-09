import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAudio from '../../hooks/useAudio';
import clockTickSfx from '../../sounds/clock_tick.mp3';
import './GameHeaderClock.scoped.scss';

const GameHeaderClock = ({ elapsedTime }) => {
  const [drawerId, currentWord, drawTime] = useSelector(state => [
    state.gamePlay.drawerId,
    state.gamePlay.currentWord,
    state.game.time - (elapsedTime || 0)
  ]);

  const [timer, setTimer] = useState(drawTime);
  const playClockTick = useAudio(clockTickSfx);

  useEffect(() => {
    // At every 1 sec set state and decrement timer
    const interval = setInterval(() => setTimer((time) => {
      // Start tick sound when 7 sec remaining and word was not guessed
      if (time === 7 && drawerId) playClockTick();

      if (time <= 0) {
        clearInterval(interval);
        return 0;
      }
      return time - 1;
    }), 1000);
    return () => clearInterval(interval);
  }, [drawerId]);

  let clockColor = 'green';
  if (drawTime / 3 > timer) { clockColor = 'red'; } else if (drawTime / 2 > timer) { clockColor = 'yellow'; }

  return (
    <div className="gameClockContentWrapper">
      { drawerId && currentWord && (
        <div className={`gameClock gameClock-${clockColor}`}>
          {timer}
        </div>
      )}
    </div>
  );
};

export default GameHeaderClock;
