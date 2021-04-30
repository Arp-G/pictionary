import React from 'react';
import { GrAlarm } from 'react-icons/gr';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import './GameHeaderClock.scss';

const GameHeaderClock = () => (
  <div className="gameClockContentWrapper">
    <CountdownCircleTimer
      isPlaying
      duration={10}
      colors={[
        ['#008000', 0.33],
        ['#F7B801', 0.33],
        ['#A30000', 0.33]
      ]}
      size={65}
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
  </div>
);

export default GameHeaderClock;
