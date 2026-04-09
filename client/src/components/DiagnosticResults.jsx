import React, { useState } from 'react';
import './styles/DiagnosticResults.css';

const DiagnosticResults = ({ result }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!result) return null;

  // Determine result color based on prediction
  const isNormal = result.prediction === 'Normal';
  const resultColor = isNormal ? '#14b8a6' : '#fb7185';
  const resultBg = isNormal ? 'rgba(20, 184, 166, 0.1)' : 'rgba(251, 113, 133, 0.1)';

  return (
    <div className="diagnostic-results">
      {/* Main Result Card */}
      <div className="result-banner" style={{ borderLeftColor: resultColor, backgroundColor: resultBg }}>
        <div className="result-header">
          <div className="result-badge">
            {isNormal ? '✅' : '⚠️'}
          </div>
          <div className="result-info">
            <h2 className="result-title">
              {result.prediction === 'Normal' ? 'Normal Lungs' : 'Pneumonia Detected'}
            </h2>
            <p className="result-subtitle">
              Confidence: <strong>{result.confidence?.toFixed(2) || '0.00'}%</strong>
            </p>
          </div>
          <div className="result-severity" style={{ borderColor: resultColor }}>
            <span className="severity-badge" style={{ color: resultColor }}>
              {result.severity || 'N/A'}
            </span>
          </div>
        </div>

        {/* Pneumonia Stage */}
        {result.pneumoniaStage && (
          <div className="stage-indicator">
            <div className="stage-label">Disease Stage:</div>
            <div className="stage-name">{result.pneumoniaStage}</div>
          </div>
        )}
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-container">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'diagnostics' ? 'active' : ''}`}
          onClick={() => setActiveTab('diagnostics')}
        >
          🔬 Diagnostics
        </button>
        <button 
          className={`tab-btn ${activeTab === 'images' ? 'active' : ''}`}
          onClick={() => setActiveTab('images')}
        >
          🖼️ Images
        </button>
      </div>

      {/* Tab Content */}
      <div className="tabs-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="tab-pane active">
            <div className="metrics-grid">
              {/* Prediction */}
              <div className="metric-card">
                <div className="metric-icon">🎯</div>
                <div className="metric-label">Prediction</div>
                <div className="metric-value" style={{ color: resultColor }}>
                  {result.prediction}
                </div>
              </div>

              {/* Confidence */}
              <div className="metric-card">
                <div className="metric-icon">📈</div>
                <div className="metric-label">Confidence</div>
                <div className="metric-value">{result.confidence?.toFixed(2)}%</div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${result.confidence}%`,
                      backgroundColor: resultColor 
                    }}
                  ></div>
                </div>
              </div>

              {/* Accuracy */}
              <div className="metric-card">
                <div className="metric-icon">✓</div>
                <div className="metric-label">Accuracy</div>
                <div className="metric-value">{result.accuracy?.toFixed(2)}%</div>
              </div>

              {/* Precision */}
              <div className="metric-card">
                <div className="metric-icon">🎪</div>
                <div className="metric-label">Precision</div>
                <div className="metric-value">
                  {result.precision !== null && result.precision !== undefined 
                    ? (result.precision > 1 ? result.precision : result.precision * 100).toFixed(2) + '%'
                    : 'N/A'}
                </div>
              </div>

              {/* F1 Score */}
              <div className="metric-card">
                <div className="metric-icon">📊</div>
                <div className="metric-label">F1 Score</div>
                <div className="metric-value">
                  {result.f1Score !== null && result.f1Score !== undefined
                    ? (result.f1Score > 1 ? result.f1Score : result.f1Score * 100).toFixed(2) + '%'
                    : 'N/A'}
                </div>
              </div>

              {/* Severity */}
              <div className="metric-card">
                <div className="metric-icon">⚡</div>
                <div className="metric-label">Severity</div>
                <div className="metric-value" style={{ color: resultColor }}>
                  {result.severity || 'N/A'}
                </div>
              </div>
            </div>

            {/* Stage Details */}
            <div className="stage-details">
              <h3>📋 Clinical Stage Information</h3>
              <div className="stage-card">
                <div className="stage-info-item">
                  <label>Pneumonia Stage:</label>
                  <span>{result.pneumoniaStage || 'Healthy Lung'}</span>
                </div>
                <div className="stage-description">
                  {getStageDescription(result.pneumoniaStage)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Diagnostics Tab */}
        {activeTab === 'diagnostics' && (
          <div className="tab-pane active">
            <div className="diagnostics-info">
              <h3>🔬 Diagnostic Analysis</h3>
              
              <div className="diagnostic-section">
                <h4>Prediction Analysis</h4>
                <p>
                  The AI model detected <strong>{result.prediction}</strong> condition 
                  with <strong>{result.confidence?.toFixed(2)}%</strong> confidence.
                </p>
              </div>

              <div className="diagnostic-section">
                <h4>Stage Classification</h4>
                <p>
                  Based on the model's analysis, the detected condition is classified as:
                  <strong style={{ display: 'block', marginTop: '8px', fontSize: '1.1rem', color: resultColor }}>
                    {result.pneumoniaStage || 'Healthy Lung'}
                  </strong>
                </p>
                {renderStageExplanation(result.pneumoniaStage)}
              </div>

              <div className="diagnostic-section">
                <h4>Quality Metrics</h4>
                <ul className="metrics-list">
                  <li>✓ Model Accuracy: {result.accuracy?.toFixed(2)}%</li>
                  <li>✓ Precision Score: {result.precision !== null && result.precision !== undefined 
                    ? (result.precision > 1 ? result.precision : result.precision * 100).toFixed(2) + '%'
                    : 'N/A'}</li>
                  <li>✓ F1 Score: {result.f1Score !== null && result.f1Score !== undefined
                    ? (result.f1Score > 1 ? result.f1Score : result.f1Score * 100).toFixed(2) + '%'
                    : 'N/A'}</li>
                  <li>✓ Confidence Level: {result.confidence?.toFixed(2)}%</li>
                </ul>
              </div>

              <div className="clinical-note">
                <strong>⚠️ Clinical Note:</strong>
                <p>
                  This analysis is for clinical support only and should not be used as a standalone diagnosis. 
                  Please consult with qualified healthcare professionals for definitive diagnosis and treatment decisions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Images Tab */}
        {activeTab === 'images' && (
          <div className="tab-pane active">
            <div className="diagnostic-images">
              <h3>🖼️ Diagnostic Visualizations</h3>
              {/* Build ordered list: Original -> Preprocessed -> Segmented -> Edges -> Heatmap */}
              {(() => {
                const images = [];

                // Original image: construct URL from result.imagePath if available
                if (result.imagePath) {
                  try {
                    const filename = result.imagePath.split(/[\\/]/).pop();
                    const serverBase = 'http://localhost:5000';
                    const url = `${serverBase}/uploads/${filename}`;
                    images.push({
                      key: 'original',
                      label: 'Original Image',
                      desc: 'Uploaded X-ray image (original)',
                      src: url,
                      isData: false
                    });
                  } catch (e) {
                    // ignore
                  }
                }

                if (result.diagnosticImages?.preprocessing) {
                  images.push({
                    key: 'preprocessing',
                    label: 'Preprocessed',
                    desc: 'Histogram equalization and noise reduction',
                    src: `data:image/png;base64,${result.diagnosticImages.preprocessing}`,
                    isData: true
                  });
                }

                if (result.diagnosticImages?.segmentation) {
                  images.push({
                    key: 'segmentation',
                    label: 'Segmented',
                    desc: 'Lung area identification and contour detection',
                    src: `data:image/png;base64,${result.diagnosticImages.segmentation}`,
                    isData: true
                  });
                }

                if (result.diagnosticImages?.edgeDetection) {
                  images.push({
                    key: 'edges',
                    label: 'Edges',
                    desc: 'Canny edge detection for feature extraction',
                    src: `data:image/png;base64,${result.diagnosticImages.edgeDetection}`,
                    isData: true
                  });
                }

                if (result.diagnosticImages?.gradcam) {
                  images.push({
                    key: 'gradcam',
                    label: 'Heatmap (Grad-CAM)',
                    desc: 'Areas of high importance in the AI decision-making process',
                    src: `data:image/png;base64,${result.diagnosticImages.gradcam}`,
                    isData: true
                  });
                }

                // Render images in order
                return images.length ? images.map((img, idx) => (
                  <div className="image-container" key={img.key}>
                    <div className="image-label">{idx + 1}. {img.label}</div>
                    <div className="image-description">{img.desc}</div>
                    {/* Use img.src directly; external URLs will load from server */}
                    <img
                      src={img.src}
                      alt={img.label}
                      className="diagnostic-image"
                      onError={(e) => { e.target.style.opacity = 0.6; e.target.title = 'Failed to load image'; }}
                    />
                  </div>
                )) : (
                  <div className="empty-state">No diagnostic images available</div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
function getStageDescription(stage) {
  const descriptions = {
    'Healthy Lung': 'No signs of pneumonia detected. Lung tissue appears normal.',
    'Congestion Stage': 'Early stage pneumonia. Lungs beginning to fill with fluid/pus.',
    'Red Hepatization Stage': 'Moderate stage pneumonia. Significant consolidation visible.',
    'Grey Hepatization Stage': 'Advanced stage pneumonia. Severe consolidation present.'
  };
  return descriptions[stage] || 'Stage information not available';
}

function renderStageExplanation(stage) {
  const explanations = {
    'Healthy Lung': (
      <p style={{ marginTop: '10px', color: '#14b8a6' }}>
        ✓ No pneumonia detected. Lungs appear healthy with clear air passages. Continue with routine health maintenance.
      </p>
    ),
    'Congestion Stage': (
      <p style={{ marginTop: '10px', color: '#ffcc00' }}>
        ⚠️ Early pneumonia stage. Fluid accumulation is beginning in the lungs. Medical consultation is recommended.
      </p>
    ),
    'Red Hepatization Stage': (
      <p style={{ marginTop: '10px', color: '#ff6600' }}>
        ⚠️ Moderate pneumonia stage. Significant consolidation visible. Immediate medical attention is advised.
      </p>
    ),
    'Grey Hepatization Stage': (
      <p style={{ marginTop: '10px', color: '#ff0000' }}>
        🚨 Severe pneumonia stage. Extensive consolidation present. Urgent medical intervention is necessary.
      </p>
    )
  };
  return explanations[stage] || null;
}

export default DiagnosticResults;
