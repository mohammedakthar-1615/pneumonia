import React, { useState, useEffect } from 'react';

import { uploadImage } from '../../services/api';
import './ProcessingIndicator.css';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/dicom'];

const ImageUpload = ({ formData, setResult, onValidation, onUploadStart }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processingStage, setProcessingStage] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Revoke object URL when component unmounts or previewUrl changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        try { URL.revokeObjectURL(previewUrl); } catch (e) { /* ignore */ }
      }
    };
  }, [previewUrl]);

  const validateFile = (selectedFile) => {
    setError('');
    if (!selectedFile) {
      setError('Please select a file');
      return false;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`);
      return false;
    }
    if (!ALLOWED_TYPES.includes(selectedFile.type) && !selectedFile.name.match(/\.(jpg|jpeg|png|dcm)$/i)) {
      setError('Only JPEG, PNG, or DICOM images are supported');
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
      // create object URL for immediate original preview
      try {
        const url = URL.createObjectURL(selectedFile);
        setPreviewUrl(url);
      } catch (e) {
        setPreviewUrl(null);
      }
      setSuccess(`File ready: ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)`);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    setError('');
    setSuccess('');

    if (!onValidation || !onValidation()) {
      setError('Please complete the patient information first');
      return;
    }

    if (!file) {
      setError('Please select an X-ray image');
      return;
    }

    setLoading(true);
    setProcessingStage(1); // Start processing animation
    if (onUploadStart) onUploadStart();

    const payload = new FormData();
    payload.append('image', file);
    payload.append('patientName', formData.patientName);
    payload.append('age', formData.age);
    payload.append('details', formData.details);

    try {
      // Simulate processing stages with timing
      const stageInterval = setInterval(() => {
        setProcessingStage(prev => {
          if (prev >= 4) {
            clearInterval(stageInterval);
            return 4;
          }
          return prev + 1;
        });
      }, 15000); // Change stage every 15 seconds

      const response = await uploadImage(payload);
      clearInterval(stageInterval);
      
      const result = response?.data || response;
      if (result) {
        setProcessingStage(5); // Completion stage
        setResult(result);
        setSuccess('✓ Analysis Complete!');
        setTimeout(() => {
          setLoading(false);
          setProcessingStage(0);
          setFile(null);
        }, 1500);
      }
    } catch (err) {
      console.error('Upload error:', err);
      let errorMessage = 'Upload failed. Please try again.';
      
      if (err.isNetworkError) {
        errorMessage = 'Network error - ensure backend server is running on port 5000';
      } else if (err.isTimeout) {
        errorMessage = 'Request timeout - server took too long to respond';
      } else if (err.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
      setLoading(false);
      setProcessingStage(0);
    }
  };

  return (
    <div className="upload-panel">
      {/* Processing Indicator - Show during analysis */}
      {loading && (
        <div className="processing-indicator">
          <div className="processing-container">
            <h3>🔄 Analyzing X-ray Image...</h3>
            <p className="processing-text">Processing diagnostic transformations</p>
            
            {/* 4-Stage Processing Animation */}
            <div className="processing-stages">
              <div className={`stage ${processingStage >= 1 ? 'active' : ''} ${processingStage > 1 ? 'completed' : ''}`}>
                <div className="stage-number">1</div>
                <div className="stage-label">Preprocessing</div>
                <div className="stage-sub">Normalization</div>
              </div>
              
              <div className={`stage ${processingStage >= 2 ? 'active' : ''} ${processingStage > 2 ? 'completed' : ''}`}>
                <div className="stage-number">2</div>
                <div className="stage-label">Segmentation</div>
                <div className="stage-sub">Lung Isolation</div>
              </div>
              
              <div className={`stage ${processingStage >= 3 ? 'active' : ''} ${processingStage > 3 ? 'completed' : ''}`}>
                <div className="stage-number">3</div>
                <div className="stage-label">Edge Detection</div>
                <div className="stage-sub">Feature Extraction</div>
              </div>
              
              <div className={`stage ${processingStage >= 4 ? 'active' : ''} ${processingStage > 4 ? 'completed' : ''}`}>
                <div className="stage-number">4</div>
                <div className="stage-label">AI Heatmap</div>
                <div className="stage-sub">Decision Focus</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="processing-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(processingStage / 5) * 100}%` }}></div>
              </div>
              <p className="progress-text">
                {processingStage === 1 && 'Processing and normalizing image...'}
                {processingStage === 2 && 'Identifying lung regions...'}
                {processingStage === 3 && 'Extracting features...'}
                {processingStage === 4 && 'Running AI inference...'}
                {processingStage === 5 && 'Generating results...'}
              </p>
            </div>

            <p className="processing-estimate">⏱️ Estimated time: 1-2 minutes</p>
          </div>
        </div>
      )}

      <div className="upload-area">
        <label className="file-label">
          <div className="file-input-wrapper">
            <span className="upload-icon">📁</span>
            <span className="upload-text">Click to select X-ray</span>
            <span className="upload-subtext">or drag and drop</span>
            <input
              className="file-input"
              type="file"
              accept="image/jpeg,image/png,.dcm"
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>
        </label>
      </div>

      {error && <div className="alert alert-error">⚠️ {error}</div>}
      {success && <div className="alert alert-success">✓ {success}</div>}
      {file && !error && !success && (
        <div className="file-preview">
          {previewUrl && (
            <div className="original-preview">
              <img src={previewUrl} alt="Original preview" style={{ maxWidth: '100%', borderRadius: 6, marginBottom: 8 }} />
            </div>
          )}
          <div className="file-info">
            <span className="file-icon">📄</span>
            <div className="file-details">
              <p className="file-name">{file.name}</p>
              <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          </div>
        </div>
      )}

      <button 
        className={`glow-btn ${loading ? 'loading' : ''}`} 
        onClick={handleUpload} 
        type="button"
        disabled={!file || loading}
      >
        <span>{loading ? '⏳ Analyzing...' : '🚀 Upload and Analyze'}</span>
      </button>
    </div>
  );
};

export default ImageUpload;

