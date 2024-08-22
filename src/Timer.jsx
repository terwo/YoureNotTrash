import React from 'react';
import './Timer.css';

const Timer = ({ time }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="timer">
      {formatTime(time)}
    </div>
  );
};

export default Timer;