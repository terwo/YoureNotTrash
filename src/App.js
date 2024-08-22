import React, { useState, useEffect } from "react";
import Spline from "@splinetool/react-spline";
import "./App.css";
import Scoreboard from "./Scoreboard";
import Timer from "./Timer";
import SuccessPopup from "./SuccessPopup";
import FailurePopup from "./FailurePopup";
import Heart from "./Heart";
import StartMenu from "./StartMenu";

const App = () => {
  const [time, setTime] = useState(120); // Start from 2 minutes
  const [targetCharacter, setTargetCharacter] = useState(0);
  const [newspaper, setNewspaper] = useState([0, 0, 0]);
  const [masonJar, setMasonJar] = useState([0, 0, 0]);
  const [can, setCan] = useState([0, 0, 0]);
  const [score, setScore] = useState(0); // Keep track of the score
  const [popupVisible, setPopupVisible] = useState(false);
  const [failurePopupVisible, setFailurePopupVisible] = useState(false);
  const [splineInstance, setSplineInstance] = useState(null); // Store the Spline instance
  const [hearts, setHearts] = useState([true, true, true]); // Start with 3 full hearts
  const [isGameStarted, setIsGameStarted] = useState(false); // Manage the start menu visibility
  const [points, setPoints] = useState(0); // Points earned in current level
  const [lastEvent, setLastEvent] = useState("mouseUp"); // Track last event emitted

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
      setCan([0.9, 0.9, 0.9]);
    }

    setTime(120); // Reset timer to 2 minutes
  };

  useEffect(() => {
    if (isGameStarted) {
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
    }
  }, [isGameStarted]);

  useEffect(() => {
    if (splineInstance) {
      console.log("useEffect called after splineInstance is set");
      // Set background color and variables
      splineInstance.setBackgroundColor("lightblue");
      // log x y and z values
      console.log(
        "newspaper: " + newspaper[0] + ", " + newspaper[1] + ", " + newspaper[2]
      );
      console.log("can: " + can[0] + ", " + can[1] + ", " + can[2]);
      console.log("Target character in useEffect: " + targetCharacter);
      splineInstance.setVariables({
        target_character: targetCharacter,
        newspaper_x: newspaper[0],
        newspaper_y: newspaper[1],
        newspaper_z: newspaper[2],
        mason_jar_x: masonJar[0],
        mason_jar_y: masonJar[1],
        mason_jar_z: masonJar[2],
        can_x: can[0],
        can_y: can[1],
        can_z: can[2],
      });
      setTargetCharacter(targetCharacter);

      // Add collision event listener
      const handleCollision = (e) => {
        console.log("collision event detected");
        const collidedObjectName = e.target.name;
        console.log("Collided object:", collidedObjectName);
        console.log("Target character in collision: " + targetCharacter);
        if (
          (targetCharacter === NEWSPAPER_FLAG && collidedObjectName === "Cube 9") ||
          (targetCharacter === MASON_JAR_FLAG && collidedObjectName === "Cube 8") ||
          (targetCharacter === CAN_FLAG && collidedObjectName === "Cube 7")
        ) {
          console.log("Correct object collided");
          handleSuccess();
        } else {
          console.log("Incorrect object collided");
          handleFailure();
        }
        splineInstance.removeEventListener("collision", handleCollision);
      };

      splineInstance.addEventListener("collision", handleCollision);

      return () => {
        splineInstance.removeEventListener("collision", handleCollision);
      };
    }
  }, [newspaper, masonJar, can, targetCharacter, splineInstance]);

  const onLoad = (spline) => {
    console.log("onLoad function called");
    setSplineInstance(spline); // Store the Spline instance
  };

  const handleSuccess = () => {
    setPopupVisible(true);
    setPoints(time); // Set points to the remaining time
    setScore((prevScore) => prevScore + time);

    // Move to the next level after the timeout has completed
    startNewLevel();
    setTimeout(() => {
      splineInstance.emitEvent("mouseUp", "clock");
      setPopupVisible(false);
    }, 4000);
  };

  const handleFailure = () => {
    const newHearts = hearts.slice();
    const firstFullHeartIndex = newHearts.findIndex(
      (heart) => heart === true
    );
    if (firstFullHeartIndex !== -1) {
      newHearts[firstFullHeartIndex] = false;
      setHearts(newHearts);
    }
    splineInstance.emitEvent("mouseDown", "clock");
    setFailurePopupVisible(true);
    setTimeout(() => {
      setFailurePopupVisible(false);
    }, 4000);
  };

  return (
    <div className="container">
      {!isGameStarted && <StartMenu onStart={() => setIsGameStarted(true)} />}
      <Spline
        scene="https://prod.spline.design/gHFmory6gXBWhOgQ/scene.splinecode"
        onLoad={onLoad}
      />
      <Scoreboard score={score} />
      <Timer time={time} />
      <div className="hearts">
        {hearts.map((isFull, index) => (
          <Heart key={index} isFull={isFull} />
        ))}
      </div>
      <SuccessPopup visible={popupVisible} points={points} />
      <FailurePopup visible={failurePopupVisible} hearts={hearts} />
    </div>
  );
};

export default App;
