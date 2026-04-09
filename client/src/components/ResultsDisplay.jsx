import React from 'react';
import DiagnosticResults from './DiagnosticResults';

const ResultsDisplay = ({ result }) => {
  if (!result) return null;

  return (
    <div className="results-display">
      <DiagnosticResults result={result} />
    </div>
  );
};

export default ResultsDisplay;
