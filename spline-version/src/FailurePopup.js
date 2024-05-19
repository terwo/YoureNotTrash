import React from "react";
import failureImage from "./assets/failure-popup.png"; // Path to your failure popup image
import fullHeart from "./assets/full-heart.png"; // Path to your full heart image
import emptyHeart from "./assets/empty-heart.png"; // Path to your empty heart image
import "./FailurePopup.css";

const FailurePopup = ({ visible, hearts }) => {
  if (!visible) return null;

  return (
    <div className="failure-popup">
      <img src={failureImage} alt="Failure" className="failure-popup-image" />
      <div className="failure-popup-hearts">
        {hearts.map((isFull, index) => (
          <img
            key={index}
            src={isFull ? fullHeart : emptyHeart}
            alt={isFull ? "Full Heart" : "Empty Heart"}
            className="heart"
          />
        ))}
      </div>
    </div>
  );
};

export default FailurePopup;
