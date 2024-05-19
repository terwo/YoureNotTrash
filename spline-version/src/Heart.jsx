import React from "react";
import fullHeart from "./assets/full-heart.png"; // Path to your full heart image
import emptyHeart from "./assets/empty-heart.png"; // Path to your empty heart image
import "./Heart.css";

const Heart = ({ isFull }) => {
  return (
    <img src={isFull ? fullHeart : emptyHeart} alt="heart" className="heart" />
  );
};

export default Heart;
