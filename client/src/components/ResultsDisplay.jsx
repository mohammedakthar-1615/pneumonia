import React from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ResultsDisplay = ({ result }) => {
  if (!result) return null;

  const isPneumonia = result.prediction?.toLowerCase().includes('pneumonia');
  const accuracy = Number(result.accuracy) || 0;
  const precision = Number(result.precision) || 0;
  const f1Score = Number(result.f1Score) || 0;

  // Data for metrics visualization
  const metricsData = [
    { name: 'Accuracy', value: accuracy },
    { name: 'Precision', value: precision },
    { name: 'F1 Score', value: f1Score }
  ];

  // Prediction confidence data for pie chart
  const confidenceData = [
    { name: 'Confidence', value: accuracy },
    { name: 'Uncertainty', value: 100 - accuracy }
  ];

  const getConfidenceColor = (value) => {
    if (value >= 90) return 'high-confidence';
    if (value >= 75) return 'medium-confidence';
    return 'low-confidence';
  };

  const getStatusColor = () => {
    return isPneumonia ? 'status-critical' : 'status-healthy';
  };

  return (
    <div className="results-display">
      {/* Header with prediction status */}
      <div className="results-header">
        <div className="results-title-section">
          <h2 className="results-title">Pneumonia Detection Analysis</h2>
          <p className="results-subtitle">
            Clinical-grade diagnostic report for {result.patientName}
          </p>
        </div>
        <div className={`results-badge ${getStatusColor()}`}>
          <span className="badge-icon">
            {isPneumonia ? '⚠️' : '✓'}
          </span>
          <div className="badge-info">
            <div className="badge-label">Diagnosis</div>
            <div className="badge-value">{result.prediction}</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-section">
        <h3 className="section-title">📊 Clinical Metrics</h3>
        <div className="metrics-grid-large">
          <div className={`metric-card ${getConfidenceColor(accuracy)}`}>
            <div className="metric-icon">🎯</div>
            <div className="metric-content">
              <div className="metric-label">Accuracy</div>
              <div className="metric-display">{accuracy.toFixed(1)}%</div>
              <div className="metric-description">Model prediction accuracy</div>
            </div>
            <div className="metric-progress">
              <div className="progress-fill" style={{ width: `${accuracy}%` }}></div>
            </div>
          </div>

          <div className={`metric-card ${getConfidenceColor(precision)}`}>
            <div className="metric-icon">🔍</div>
            <div className="metric-content">
              <div className="metric-label">Precision</div>
              <div className="metric-display">{precision.toFixed(1)}%</div>
              <div className="metric-description">Detection specificity</div>
            </div>
            <div className="metric-progress">
              <div className="progress-fill" style={{ width: `${precision}%` }}></div>
            </div>
          </div>

          <div className={`metric-card ${getConfidenceColor(f1Score)}`}>
            <div className="metric-icon">⚙️</div>
            <div className="metric-content">
              <div className="metric-label">F1 Score</div>
              <div className="metric-display">{f1Score.toFixed(1)}%</div>
              <div className="metric-description">Harmonic mean score</div>
            </div>
            <div className="metric-progress">
              <div className="progress-fill" style={{ width: `${f1Score}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-section">
        <div className="chart-container">
          <h4 className="chart-title">Metrics Comparison</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metricsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
              <XAxis dataKey="name" stroke="var(--muted)" />
              <YAxis stroke="var(--muted)" />
              <Tooltip 
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                  borderRadius: '12px'
                }}
                formatter={(value) => `${value.toFixed(2)}%`}
              />
              <Bar dataKey="value" fill="#14b8a6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h4 className="chart-title">Confidence Level</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={confidenceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                <Cell fill="#14b8a6" />
                <Cell fill="rgba(148, 163, 184, 0.2)" />
              </Pie>
              <Tooltip 
                formatter={(value) => `${value.toFixed(1)}%`}
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(20, 184, 166, 0.3)',
                  borderRadius: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Patient Info & Timestamps */}
      <div className="patient-info-section">
        <h3 className="section-title">📋 Patient Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Name</span>
            <span className="info-value">{result.patientName}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Age</span>
            <span className="info-value">{result.age} years</span>
          </div>
          <div className="info-item">
            <span className="info-label">Exam Date</span>
            <span className="info-value">{new Date(result.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Exam Time</span>
            <span className="info-value">{new Date(result.createdAt).toLocaleTimeString()}</span>
          </div>
        </div>
        {result.details && (
          <div className="clinical-notes">
            <h4>Clinical Notes</h4>
            <p>{result.details}</p>
          </div>
        )}
      </div>

      {/* Clinical Recommendations */}
      <div className="recommendations-section">
        <h3 className="section-title">📌 Clinical Recommendations</h3>
        <div className="recommendations-list">
          {isPneumonia ? (
            <>
              <div className="recommendation danger">
                <span className="rec-icon">⚠️</span>
                <span className="rec-text">Pneumonia detected - recommend immediate clinical evaluation</span>
              </div>
              <div className="recommendation neutral">
                <span className="rec-icon">💊</span>
                <span className="rec-text">Consider antibiotic therapy pending culture results</span>
              </div>
              <div className="recommendation neutral">
                <span className="rec-icon">📅</span>
                <span className="rec-text">Schedule follow-up imaging in 7-10 days</span>
              </div>
            </>
          ) : (
            <>
              <div className="recommendation success">
                <span className="rec-icon">✓</span>
                <span className="rec-text">No pneumonia detected - monitor patient condition</span>
              </div>
              <div className="recommendation neutral">
                <span className="rec-icon">👁️</span>
                <span className="rec-text">Continue routine clinical observation</span>
              </div>
              <div className="recommendation neutral">
                <span className="rec-icon">📅</span>
                <span className="rec-text">Retest if symptoms persist after 3-5 days</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="disclaimer">
        <p>
          <strong>⚕️ Important:</strong> This analysis is an AI-assisted diagnostic tool designed for clinical support only.
          It is not a substitute for professional medical judgment. All results must be reviewed and confirmed by qualified healthcare professionals.
          Use in accordance with applicable medical guidelines and regulations.
        </p>
      </div>
    </div>
  );
};

export default ResultsDisplay;
