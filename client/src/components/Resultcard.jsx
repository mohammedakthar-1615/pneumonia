import React from 'react';

const ResultCard = ({ result }) => {
  if (!result) return null;

  const isPneumonia = result.prediction?.toLowerCase().includes('pneumonia');

  return (
    <div className="result-card">
      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap' }}>
          <div>
            <p className="metric-label">Patient</p>
            <p className="metric-value">{result.patientName}</p>
          </div>
          <div>
            <p className="metric-label">Exam date</p>
            <p className="metric-value">{new Date(result.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="metric-label">Status</p>
            <span className={`status-pill ${isPneumonia ? 'danger' : 'healthy'}`}>
              {result.prediction}
            </span>
          </div>
        </div>

        <div className="metric-grid">
          <div className="metric-box">
            <span className="metric-label">Accuracy</span>
            <span className="metric-value">{Number(result.accuracy).toFixed(2)}%</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">Precision</span>
            <span className="metric-value">{Number(result.precision).toFixed(2)}%</span>
          </div>
          <div className="metric-box">
            <span className="metric-label">F1 Score</span>
            <span className="metric-value">{Number(result.f1Score).toFixed(2)}%</span>
          </div>
        </div>

        <div style={{ marginTop: '18px', color: 'var(--muted)' }}>
          <p>
            The prediction summary is created from the model inference, presenting the current pneumonia risk and key evaluation metrics.
            These insights are designed for clinical review and longitudinal follow-up.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;

