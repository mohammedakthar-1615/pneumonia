import React from 'react';

const PatientForm = ({ formData, onChange, validationErrors = {} }) => {
  const handleChange = (e) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="form-panel">
      <div className="form-group">
        <label className="form-label">
          Full Patient Name *
          <input
            className={`input-field ${validationErrors.patientName ? 'input-error' : ''}`}
            type="text"
            name="patientName"
            placeholder="e.g., John Smith"
            value={formData.patientName}
            onChange={handleChange}
            maxLength="100"
          />
        </label>
        {validationErrors.patientName && (
          <span className="error-message">⚠️ {validationErrors.patientName}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Age (years) *
          <input
            className={`input-field ${validationErrors.age ? 'input-error' : ''}`}
            type="number"
            name="age"
            placeholder="Enter age"
            value={formData.age}
            onChange={handleChange}
            min="0"
            max="150"
          />
        </label>
        {validationErrors.age && (
          <span className="error-message">⚠️ {validationErrors.age}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Clinical Notes (Optional)
          <textarea
            className="textarea-field"
            name="details"
            placeholder="Symptoms, medical history, or relevant clinical observations"
            value={formData.details}
            onChange={handleChange}
            rows="5"
            maxLength="500"
          />
        </label>
        <span className="char-count">{formData.details.length}/500</span>
      </div>
    </div>
  );
};

export default PatientForm;
