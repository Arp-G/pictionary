import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { GrAlarm } from 'react-icons/gr';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import './GameHeaderClock.scss';

const GameHeaderClock = ({ elapsedTime }) => {
  const [drawerId, currentWord, drawTime] = useSelector(state => [
    state.gamePlay.drawerId,
    state.gamePlay.currentWord,
    state.game.time - (elapsedTime || 0)
  ]);

  console.log(`SET INITIAL DRAW TIME TO ${drawTime}`);
  const [timer, setTimer] = useState(drawTime);

  useEffect(() => {
    const interval = setInterval(() => setTimer((time) => {
      console.log(`GOT time as ${time}`);
      if (time <= 0) {
        console.log("clearing " + interval);
        clearInterval(interval); return 0;
      }
      return time - 1;
    }), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="gameClockContentWrapper">
      { drawerId && currentWord && (
        <h3>
          {timer}
        </h3>
        // <CountdownCircleTimer
        //   isPlaying
        //   duration={drawTime}
        //   colors={[
        //     ['#008000', 0.33],
        //     ['#F7B801', 0.33],
        //     ['#A30000', 0.33]
        //   ]}
        //   size={60}
        //   strokeWidth={7}
        // >
        //   {
        //     ({ remainingTime }) => (
        //       <div>
        //         <GrAlarm className="gameClockContentIcon" />
        //         <div className="gameClockContentText">{remainingTime}</div>
        //       </div>
        //     )
        //   }
        // </CountdownCircleTimer>
      )}
    </div>
  );
};

export default GameHeaderClock;
