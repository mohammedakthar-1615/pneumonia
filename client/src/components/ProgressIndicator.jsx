import React, { useState, useEffect } from 'react';

const ProgressIndicator = ({ isActive = false, message = 'Analyzing X-ray...' }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }

    // Simulate progress with random increments
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Progress reaches 90% and slows down
        if (prev >= 90) return prev;
        const increment = Math.random() * (20 - 5) + 5; // 5-20% increment
        return Math.min(prev + increment, 90);
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isActive]);

  // When analysis completes, jump to 100%
  useEffect(() => {
    if (progress >= 90 && isActive) {
      setProgress(100);
    }
  }, [progress, isActive]);

  if (!isActive) return null;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <div className="progress-label">{message}</div>
        <div className="progress-percentage">{Math.round(progress)}%</div>
      </div>
      <div className="progress-bar-wrapper">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="progress-steps">
        <div className={`progress-step ${progress >= 25 ? 'active' : ''}`}>
          <span className="step-icon">📤</span>
          <span className="step-label">Upload</span>
        </div>
        <div className={`progress-step ${progress >= 50 ? 'active' : ''}`}>
          <span className="step-icon">🔍</span>
          <span className="step-label">Detect</span>
        </div>
        <div className={`progress-step ${progress >= 75 ? 'active' : ''}`}>
          <span className="step-icon">⚙️</span>
          <span className="step-label">Process</span>
        </div>
        <div className={`progress-step ${progress >= 100 ? 'active' : ''}`}>
          <span className="step-icon">✅</span>
          <span className="step-label">Complete</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
