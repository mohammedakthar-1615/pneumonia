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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Patient', patientSchema);