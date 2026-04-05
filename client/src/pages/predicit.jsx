import React, { useState } from 'react';
import ImageUpload from '../components/upload/imageUpload';
import PatientForm from '../components/PatientForm';
import ResultsDisplay from '../components/ResultsDisplay';
import ProgressIndicator from '../components/ProgressIndicator';

const clinicalGuidelines = [
  'Patient identity must be unique in the system',
  'High-quality digital X-rays (DICOM or JPG/PNG) are recommended',
  'Ensure frontal chest view is captured',
  'Results are for clinical support only—not a diagnosis',
  'Repeat scans help track pneumonia recovery and treatment response'
];

const Predict = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    details: ''
  });
  const [result, setResult] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.patientName.trim()) errors.patientName = 'Patient name is required';
    if (!formData.age || formData.age <= 0) errors.age = 'Valid age is required';
    if (formData.age > 150) errors.age = 'Please enter a valid age';
    return errors;
  };

  const handleValidation = () => {
    const errors = validateForm();
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUploadStart = () => {
    setIsAnalyzing(true);
    setResult(null);
  };

  const handleUploadComplete = (data) => {
    setIsAnalyzing(false);
    setResult(data);
  };

  return (
    <main className="page predict-page">
      <section className="card hero-panel">
        <div className="hero-badge">🏥 Hospital-Grade Analysis</div>
        <h1 className="hero-title">Pneumonia Detection Diagnostic System</h1>
        <p className="hero-copy">
          Advanced AI-powered X-ray analysis for early pneumonia detection. Upload patient scans and receive clinical-grade confidence metrics with accuracy, precision, and F1-scores to support diagnostic decisions.
        </p>
      </section>

      {/* Progress Indicator */}
      <ProgressIndicator isActive={isAnalyzing} message="Analyzing chest X-ray..." />

      {/* Results Display */}
      {result && !isAnalyzing && (
        <ResultsDisplay result={result} />
      )}

      {/* Input Forms - Only show if not showing results */}
      {!result && (
        <section className="predict-grid predict-3col">
          <div className="card clinical-card">
            <h3 className="section-title">📋 Patient Information</h3>
            <PatientForm formData={formData} onChange={handleFormChange} validationErrors={validationErrors} />
          </div>

          <div className="card clinical-card">
            <h3 className="section-title">🖼️ X-ray Upload</h3>
            <ImageUpload 
              formData={formData} 
              setResult={handleUploadComplete}
              onValidation={handleValidation}
              onUploadStart={handleUploadStart}
            />
          </div>

          <div className="card clinical-guidelines">
            <h3 className="section-title">📌 Clinical Guidelines</h3>
            <ul className="guidelines-list">
              {clinicalGuidelines.map((guideline, idx) => (
                <li key={idx}>{guideline}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* New Analysis Button */}
      {result && (
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
          <button 
            className="ghost-btn" 
            onClick={() => setResult(null)}
          >
            ← New Analysis
          </button>
          <button 
            className="glow-btn" 
            onClick={() => window.print()}
          >
            🖨️ Print Report
          </button>
        </div>
      )}
    </main>
  );
};

export default Predict;
