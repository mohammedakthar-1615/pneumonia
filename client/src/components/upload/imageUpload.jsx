import React, { useState } from 'react';
import { uploadImage } from '../../services/api';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/dicom'];

const ImageUpload = ({ formData, setResult, onValidation, onUploadStart }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    if (onUploadStart) onUploadStart();

    const payload = new FormData();
    payload.append('image', file);
    payload.append('patientName', formData.patientName);
    payload.append('age', formData.age);
    payload.append('details', formData.details);

    try {
      const response = await uploadImage(payload);
      const result = response?.data || response;
      if (result) {
        setResult(result);
      }
      setSuccess('✓ Analysis submitted! Processing...');
      setFile(null);
      setTimeout(() => setLoading(false), 1000);
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
    }
  };

  return (
    <div className="upload-panel">
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
