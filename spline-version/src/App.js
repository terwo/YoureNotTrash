import React, { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import './App.css';
import Scoreboard from './Scoreboard';
import Timer from './Timer';
import Popup from './Popup';

const App = () => {
  const [time, setTime] = useState(120); // Start from 2 minutes
  const [targetCharacter, setTargetCharacter] = useState(0);
  const [newspaper, setNewspaper] = useState([0, 0, 0]);
  const [masonJar, setMasonJar] = useState([0, 0, 0]);
  const [can, setCan] = useState([0, 0, 0]);
  const [score, setScore] = useState(0); // Keep track of the score
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  // Function to start a new level
  const startNewLevel = () => {
    const randomValue = Math.floor(Math.random() * 3) * 100 + 100;
    setTargetCharacter(randomValue);
    console.log(randomValue);

    if (randomValue === 100) {
      setNewspaper([3.11, 3.07, 3.06]);
      setMasonJar([0, 0, 0]);
      setCan([0, 0, 0]);
    } else if (randomValue === 200) {
      setNewspaper([0, 0, 0]);
      setMasonJar([Math.random() * 10, Math.random() * 10, Math.random() * 10]);
      setCan([0, 0, 0]);
    } else {
      setNewspaper([0, 0, 0]);
      setMasonJar([0, 0, 0]);
      setCan([1, 1, 1]);
    }

    setTime(120); // Reset timer to 2 minutes
  };

  useEffect(() => {
    startNewLevel(); // Start the first level

    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const onLoad = (spline) => {
    // Set background color and variables
    spline.setBackgroundColor('lightblue');
    spline.setVariables({
      target_character: targetCharacter,
      newspaper_x: newspaper[0], newspaper_y: newspaper[1], newspaper_z: newspaper[2],
      mason_jar_x: masonJar[0], mason_jar_y: masonJar[1], mason_jar_z: masonJar[2],
      can_x: can[0], can_y: can[1], can_z: can[2],
    });

    // Add collision event listener
    spline.addEventListener('collision', (e) => {
      // Check if collided with the correct target
      if ((e.target.name === 'newspaper' && targetCharacter === 100) ||
          (e.target.name === 'masonJar' && targetCharacter === 200) ||
          (e.target.name === 'can' && targetCharacter === 300)) {
        // Add points based on remaining time
        setScore((prevScore) => prevScore + time);

        setPopupMessage('Success!');
        setPopupVisible(true);
        setTimeout(() => {
          setPopupVisible(false);
        }, 3000);

        // Start a new level
        startNewLevel();
      }
    });

    // Get all objects in the scene after loading
    const events = spline.getSplineEvents();
    console.log(events);
  };

  return (
    <div className="container">
      <Spline scene="https://prod.spline.design/QIhWCVfzQaL7jMhB/scene.splinecode" onLoad={onLoad} />
      <Scoreboard score={score} />
      <Timer time={time} />
      <Popup message={popupMessage} visible={popupVisible} />
    </div>
  );
};

export default App;
