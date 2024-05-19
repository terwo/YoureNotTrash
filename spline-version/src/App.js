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
    const preloadScene = async () => {
      const canvas = canvasRef.current;
      const spline = new Application(canvas);

      // Generate random character variables
      // const randomValue = Math.floor(Math.random() * 3) * 100 + 100;
      const randomValue = 100;
      setTargetCharacter(randomValue);

      let newNewspaper = [0, 0, 0];
      let newMasonJar = [0, 0, 0];
      let newGarbage = [0, 0, 0];

      if (randomValue === 100) {
        newNewspaper = [1.46, 1.48, 1.56];
        setNewspaper(newNewspaper);
      } else if (randomValue === 200) {
        newMasonJar = [Math.random() * 10, Math.random() * 10, Math.random() * 10];
        setMasonJar(newMasonJar);
      } else {
        newGarbage = [Math.random() * 10, Math.random() * 10, Math.random() * 10];
        setGarbage(newGarbage);
      }

      const [newspaper_x, newspaper_y, newspaper_z] = newNewspaper;
      const [mason_jar_x, mason_jar_y, mason_jar_z] = newMasonJar;
      const [garbage_x, garbage_y, garbage_z] = newGarbage;

      // Load the scene with preloaded settings
      await spline.load('https://prod.spline.design/QIhWCVfzQaL7jMhB/scene.splinecode', {
        credentials: 'include',
        mode: 'no-cors',
      });

      // Set background color and variables
      spline.setBackgroundColor('lightblue');
      spline.setVariables({
        target_character: randomValue,
        newspaper_x, newspaper_y, newspaper_z,
        mason_jar_x, mason_jar_y, mason_jar_z,
        garbage_x, garbage_y, garbage_z,
        level_complete: false,
      });

      // Add mouse down event listener -- this is to test the spline event listener -- hopefully can use the trigger area event
      spline.addEventListener('start', (e) => {
        if (e.target.name === 'newspaper') {
          setPopupMessage('Newspaper Clicked!');
          setPopupVisible(true);
          setTimeout(() => {
            setPopupVisible(false);
          }, 3000);
        }});
      // Get the Spline variables after 10 seconds have passed
      // setTimeout(() => {
      //   const variables = spline.getVariables();
      //   console.log(variables);
      // }, 10000);

      spline.addEventListener("collision", (e) => {
        console.log("collision even detected");
        console.log("level complete: "+ spline.getVariable("level_complete"));
        if (spline.getVariable("level_complete")) {
          // spline.stop();
          spline.emitEvent("mouseUp", "clock");
          // spline.play();
          console.log("reset emitted");
        }
      });
      
  };


    preloadScene();

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
