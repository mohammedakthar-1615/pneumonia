import React, { useState } from 'react';

const ImageUpload = ({ formData, setResult }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !formData.patientName) {
      alert('Please complete the patient profile and choose an X-ray file.');
      return;
    }

    const payload = new FormData();
    payload.append('image', file);
    payload.append('patientName', formData.patientName);
    payload.append('age', formData.age);
    payload.append('details', formData.details);

    setIsLoading(true);
    setProgress('Uploading...');

    try {
      const controller = new AbortController();
      
      // Start timeout but give 5 minutes
      const timeoutId = setTimeout(() => {
        console.warn('Request timeout triggered after 5 minutes');
        controller.abort();
      }, 300000);

      setProgress('Preprocessing X-ray...');
      
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: payload,
        signal: controller.signal,
        headers: {
          'Connection': 'keep-alive'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage = `Upload failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error('Could not parse error response:', e);
        }
        throw new Error(errorMessage);
      }

      setProgress('Processing complete! Saving results...');
      const data = await response.json();
      
      setResult(data.data);
      setProgress('');
      alert('✅ Upload and analysis successful!');
      setFile(null);
    } catch (error) {
      console.error('Upload error:', error);
      setProgress('');
      
      if (error.name === 'AbortError') {
        alert('⚠️ Request timeout after 5 minutes. ML service may still be processing. Please check your patient history.');
      } else if (error.message.includes('Failed to fetch')) {
        alert('❌ Network connection lost. Please check:\n1. Backend server running on port 5000\n2. ML service running on port 5001\n3. Your internet connection');
      } else {
        alert(`❌ Upload failed: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="upload-panel">
      <label className="file-label">
        Select X-ray image
        <input
          className="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isLoading}
        />
      </label>
      {file && <p className="status-copy">Selected file: {file.name}</p>}
      {progress && <p className="progress-text" style={{ color: '#4a9eff', marginTop: '10px' }}>📊 {progress}</p>}
      <button 
        className="glow-btn" 
        onClick={handleUpload} 
        type="button"
        disabled={isLoading}
      >
        {isLoading ? `Processing... (Up to 2 minutes)` : 'Upload and Analyze'}
      </button>
    </div>
  );
};

export default ImageUpload;