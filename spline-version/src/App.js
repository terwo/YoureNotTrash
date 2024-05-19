import React, { useEffect, useRef, useState } from 'react';
import { Application } from '@splinetool/runtime';
import './App.css';
import Scoreboard from './Scoreboard';
import Timer from './Timer';
import Popup from './Popup';

const App = () => {
  const canvasRef = useRef(null);
  const [time, setTime] = useState(0);
  const [targetCharacter, setTargetCharacter] = useState(0);
  const [newspaper, setNewspaper] = useState([0, 0, 0]);
  const [masonJar, setMasonJar] = useState([0, 0, 0]);
  const [garbage, setGarbage] = useState([0, 0, 0]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

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
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <div className="container">
      <canvas id="canvas3d" ref={canvasRef}></canvas>
      <Scoreboard />
      <Timer time={time} />
      <Popup message={popupMessage} visible={popupVisible} />
    </div>
  );
};

export default App;
