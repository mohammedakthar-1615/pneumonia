import React, { useState } from 'react';
import { uploadImage } from '../../services/api';

const ImageUpload = ({ formData, setResult }) => {
  const [file, setFile] = useState(null);

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

    try {
      const response = await uploadImage(payload);
      setResult(response.data.data);
    } catch (error) {
      console.error(error);
      alert('Upload failed. Please try again.');
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
        />
      </label>
      {file && <p className="status-copy">Selected file: {file.name}</p>}
      <button className="glow-btn" onClick={handleUpload} type="button">
        Upload and Analyze
      </button>
    </div>
  );
};

export default ImageUpload;
