import React from 'react';
import { useSelector } from 'react-redux';
import { GrAlarm } from 'react-icons/gr';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import './GameHeaderClock.scss';

const GameHeaderClock = () => {
  const [drawerId, currentWord, drawTime] = useSelector(state => [state.gamePlay.drawerId, state.gamePlay.currentWord, state.game.time]);

  return (
    <div className="gameClockContentWrapper">
      { drawerId && currentWord && (
        <CountdownCircleTimer
          isPlaying
          duration={drawTime}
          colors={[
            ['#008000', 0.33],
            ['#F7B801', 0.33],
            ['#A30000', 0.33]
          ]}
          size={60}
          strokeWidth={7}
        >
          {
            ({ remainingTime }) => (
              <div>
                <GrAlarm className="gameClockContentIcon" />
                <div className="gameClockContentText">{remainingTime}</div>
              </div>
            )
          }
        </CountdownCircleTimer>
      )}
    </div>
  );
};

export default GameHeaderClock;
