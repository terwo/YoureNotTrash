import React from "react";
import successImage from "./assets/success-popup.png"; // Path to your success popup image
import "./SuccessPopup.css";

const SuccessPopup = ({ visible }) => {
  if (!visible) return null;

  return (
    <div className="success-popup">
      <img src={successImage} alt="Success" className="success-popup-image" />
    </div>
  );
};

export default SuccessPopup;
