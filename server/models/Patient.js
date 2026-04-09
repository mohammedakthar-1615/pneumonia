const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
    index: true
  },
  age: {
    type: Number,
    required: true
  },
  details: {
    type: String,
    default: ''
  },
  imagePath: {
    type: String,
    required: true
  },
  prediction: {
    type: String,
    required: true // e.g., "Pneumonia" or "Normal"
  },
  confidence: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  },
  precision: {
    type: Number,
    required: true
  },
  f1Score: {
    type: Number,
    required: true
  },
  // Pneumonia stage information
  pneumoniaStage: {
    type: String,
    default: 'Healthy Lung'
  },
  severity: {
    type: String,
    enum: ['Healthy', 'Mild', 'Moderate', 'Severe'],
    default: 'Healthy'
  },
  // Diagnostic images (base64 encoded)
  diagnosticImages: {
    preprocessing: {
      type: String,
      default: null
    },
    segmentation: {
      type: String,
      default: null
    },
    edgeDetection: {
      type: String,
      default: null
    },
    gradcam: {
      type: String,
      default: null
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Patient', patientSchema);