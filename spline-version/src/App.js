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
  const [splineInstance, setSplineInstance] = useState(null); // Store the Spline instance

  const NEWSPAPER_FLAG = 200;
  const MASON_JAR_FLAG = 300;
  const CAN_FLAG = 100;

  // Function to start a new level
  const startNewLevel = () => {
    const randomValue = Math.floor(Math.random() * 3) * 100 + 100;
    setTargetCharacter(randomValue);
    console.log(randomValue);

    if (randomValue === NEWSPAPER_FLAG) {
      setNewspaper([2.6, 2.7, 2.51]);
      setMasonJar([0, 0, 0]);
      setCan([0, 0, 0]);
    } else if (randomValue === MASON_JAR_FLAG) {
      setNewspaper([0, 0, 0]);
      setMasonJar([2.4, 2.4, 2.4]);
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

  useEffect(() => {
    if (splineInstance) {
      console.log("useEffect called after splineInstance is set")
      // Set background color and variables
      splineInstance.setBackgroundColor('lightblue');
      // log x y and z values
      console.log("newspaper: " + newspaper[0] + ", " + newspaper[1] + ", " + newspaper[2]);
      console.log("can: " + can[0] + ", " + can[1] + ", " + can[2]);
      splineInstance.setVariables({
        target_character: targetCharacter,
        newspaper_x: newspaper[0], newspaper_y: newspaper[1], newspaper_z: newspaper[2],
        mason_jar_x: masonJar[0], mason_jar_y: masonJar[1], mason_jar_z: masonJar[2],
        can_x: can[0], can_y: can[1], can_z: can[2],
      });

      // Add collision event listener
      splineInstance.addEventListener('collision', (e) => {
        console.log("collision event detected");
        console.log("level complete: " + splineInstance.getVariable("level_complete"));
        if (splineInstance.getVariable("level_complete")) {
          // splineInstance.stop();
          // Display success message
          setPopupMessage('Success!');
          setPopupVisible(true);
          setScore((prevScore) => prevScore + time);
          splineInstance.setVariables({ level_complete: false });
          
          // Move going to the next level after the timeout has completed
          setTimeout(() => {
            startNewLevel();
            setPopupVisible(false);
            // Start a new level
            splineInstance.emitEvent("mouseUp", "clock");
            // splineInstance.play();
            console.log("reset emitted");
          }, 4000);
          
        }
      });
    }
  }, [newspaper, masonJar, can, targetCharacter, splineInstance]);

  const onLoad = (spline) => {
    console.log("onLoad function called");
    setSplineInstance(spline); // Store the Spline instance
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
