import React from 'react';
import './Popup.css';

const Popup = ({ message, visible }) => {
  return (
    visible && (
      <div className="popup">
        {message}
      </div>
    )
  );
};

export default Popup;
