import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useAudio from '../../hooks/useAudio';
import clockTickSfx from '../../sounds/clock_tick.mp3';
import './GameHeaderClock.scss';

const GameHeaderClock = ({ elapsedTime }) => {
  const [drawerId, currentWord, drawTime] = useSelector(state => [
    state.gamePlay.drawerId,
    state.gamePlay.currentWord,
    state.game.time - (elapsedTime || 0)
  ]);

  const [timer, setTimer] = useState(drawTime);
  const playClockTick = useAudio(clockTickSfx);

  useEffect(() => {
    const interval = setInterval(() => setTimer((time) => {
      // Start tick sound when 5 sec remaining
      if (time === 7) {
        console.log("Trying to play tick");
        playClockTick();
      }

      if (time <= 0) {
        clearInterval(interval);
        return 0;
      }
      return time - 1;
    }), 1000);
    return () => clearInterval(interval);
  }, []);

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
