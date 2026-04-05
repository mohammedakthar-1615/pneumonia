const Patient = require('../models/Patient');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// POST /upload
exports.uploadImage = async (req, res) => {
  try {
    const { patientName, age, details } = req.body;
    const image = req.file;

    // Validation
    if (!patientName || !patientName.trim()) {
      return res.status(400).json({ error: 'Patient name is required' });
    }

    if (!age || age < 1 || age > 150) {
      return res.status(400).json({ error: 'Valid age (1-150) is required' });
    }

    if (!image) {
      return res.status(400).json({ error: 'X-ray image file is required' });
    }

    // Save image to uploads folder
    const uploadsDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const imagePath = path.join(uploadsDir, image.filename);

    // Move file to uploads
    try {
      fs.renameSync(image.path, imagePath);
    } catch (err) {
      console.error('File move error:', err);
      return res.status(500).json({ error: 'Failed to save image file' });
    }

    // Call ML service with retry/fallback logic
    let mlResponse;
    try {
      mlResponse = await axios.post('http://localhost:5001/predict', {
        imagePath: imagePath
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      if (!mlResponse?.data) {
        throw new Error('ML service returned invalid response');
      }
    } catch (mlError) {
      console.error('ML Service error:', mlError.message, mlError.response?.data || 'No response body');

      const fallbackMessage = mlError.response?.data?.error ||
        mlError.message ||
        'ML Service unavailable - prediction pending';

      mlResponse = {
        data: {
          prediction: 'PENDING',
          accuracy: 0,
          precision: 0,
          f1Score: 0,
          status: fallbackMessage
        }
      };
    }

    const { prediction, accuracy, precision, f1Score, status } = mlResponse.data;

    // Save to DB
    const patient = new Patient({
      patientName: patientName.trim(),
      age: parseInt(age),
      details: details || '',
      imagePath,
      prediction: prediction || 'PENDING',
      accuracy: accuracy || 0,
      precision: precision || 0,
      f1Score: f1Score || 0,
      status: status || null
    });

    const savedPatient = await patient.save();

    res.status(201).json({
      message: 'Upload successful and sent to analysis',
      data: savedPatient,
      success: true
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// GET /patient/:name
exports.getPatientHistory = async (req, res) => {
  try {
    const { name } = req.params;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Patient name is required' });
    }
    
    const patients = await Patient.find({ patientName: { $regex: name, $options: 'i' } })
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.json({
      success: true,
      data: patients,
      count: patients.length
    });
  } catch (error) {
    console.error('History fetch error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to fetch patient history' });
  }
};

// GET all patients with pagination
exports.getAllPatients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const patients = await Patient.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Patient.countDocuments();

    res.json({
      success: true,
      data: patients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Patients fetch error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to fetch patients' });
  }
};

// PUT /patient/:id
exports.updatePatientReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { age, details, prediction, accuracy, precision, f1Score } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      id,
      {
        age,
        details,
        prediction,
        accuracy,
        precision,
        f1Score,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ error: 'Patient record not found' });
    }

    res.json({
      message: 'Report updated successfully',
      data: patient,
      success: true
    });
  } catch (error) {
    console.error('Update error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to update report' });
  }
};

// GET /patient/id/:id
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findById(id);
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient record not found' });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Get patient error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to fetch patient' });
  }
};