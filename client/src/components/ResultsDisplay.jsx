import React from 'react';
import DiagnosticResults from './DiagnosticResults';
import GraphView from './GraphView';

const ResultsDisplay = ({ result }) => {
  if (!result) return null;

  // Convert single result to array format for GraphView
  const resultArray = [result];

  return (
    <div className="results-display">
      <DiagnosticResults result={result} />
      
      {/* Show metrics progression graph for this prediction */}
      <div style={{ marginTop: '40px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>📊 Prediction Metrics Overview</h2>
          <GraphView data={resultArray} />
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
