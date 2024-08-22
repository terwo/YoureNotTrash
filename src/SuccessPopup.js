import React from "react";
import successImage from "./assets/success-popup.png"; // Path to your success popup image
import "./SuccessPopup.css";

const SuccessPopup = ({ visible, points }) => {
  if (!visible) return null;

  return (
    <div className="success-popup">
      <img src={successImage} alt="Success" className="success-popup-image" />
      <div className="success-popup-points">+{points}</div>
    </div>
  );
};

export default SuccessPopup;
