import React from 'react';
import './styles/Loader.css';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-card">
        <div className="animated-loader">
          <div className="pulse-ring"></div>
          <div className="pulse-ring pulse-ring-2"></div>
          <div className="pulse-ring pulse-ring-3"></div>
          <div className="scanner-line"></div>
          <div className="center-dot"></div>
        </div>
        <div className="loader-text">
          <h3>Analyzing X-Ray</h3>
          <p>Advanced AI processing in progress...</p>
        </div>
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
