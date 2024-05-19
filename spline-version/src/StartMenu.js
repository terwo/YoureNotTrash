import React from "react";
import logo from "./assets/game-logo.png"; // Path to your logo image
import startButton from "./assets/play-button.png"; // Path to your start button image
import "./StartMenu.css";

const StartMenu = ({ onStart }) => {
  return (
    <div className="start-menu">
      <div className="start-menu-content">
        <img src={logo} alt="Logo" className="start-menu-logo" />
        <p className="start-menu-text">...YET.</p>
        <img
          src={startButton}
          alt="Start"
          className="start-menu-button"
          onClick={onStart}
        />
      </div>
    </div>
  );
};

export default StartMenu;
