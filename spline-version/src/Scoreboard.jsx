import React from 'react';
import './Scoreboard.css';

const Scoreboard = ({ score }) => {
  return (
    <div className="scoreboard">
      <p>{score}</p>
    </div>
  );
};

export default Scoreboard;
