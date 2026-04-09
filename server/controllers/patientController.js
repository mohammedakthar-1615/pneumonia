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
    const mlStartTime = Date.now();
    try {
      console.log(`[ML Service] Calling /predict with imagePath: ${imagePath}`);
      console.log(`[ML Service] Request timeout: 120000ms (2 minutes)`);
      
      mlResponse = await axios.post('http://localhost:5001/predict', {
        imagePath: imagePath
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 120000  // Increased timeout to 2 minutes for large images
      });

      const mlElapsed = Date.now() - mlStartTime;
      console.log(`[ML Service] ✓ Response received in ${mlElapsed}ms`);
      
      if (!mlResponse?.data) {
        throw new Error('ML service returned invalid response structure');
      }
      
      console.log(`[ML Service] ✓ Got response from /predict: prediction=${mlResponse.data.prediction}, confidence=${mlResponse.data.confidence}`);
      
    } catch (mlError) {
      const mlElapsed = Date.now() - mlStartTime;
      console.error(`❌ [ML Service] Error after ${mlElapsed}ms: ${mlError.message}`);
      console.error(`❌ [ML Service] Error code: ${mlError.code}`);
      console.error(`❌ [ML Service] Response status: ${mlError.response?.status}`);
      console.error(`❌ [ML Service] Response data:`, mlError.response?.data);
      console.error(`❌ [ML Service] Timeout? ${mlError.code === 'ECONNABORTED'}`);

      const fallbackMessage = mlError.response?.data?.error ||
        mlError.message ||
        'ML Service unavailable - prediction pending';

      mlResponse = {
        data: {
          prediction: 'PENDING',
          accuracy: 0,
          precision: 0,
          f1Score: 0,
          confidence: 0,
          severity: 'N/A',
          pneumoniaStage: 'Unknown',
          status: fallbackMessage,
          errorDetails: {
            mlServiceError: mlError.message,
            elapsedTime: mlElapsed,
            responseStatus: mlError.response?.status
          }
        }
      };
    }

    const { 
      prediction, 
      accuracy, 
      precision, 
      f1Score,
      confidence,
      pneumoniaStage,
      severity,
      diagnosticImages 
    } = mlResponse.data;

    console.log(`[Patient Save] Preparing to save:`, {
      prediction,
      confidence,
      pneumoniaStage,
      severity,
      hasImages: !!diagnosticImages,
      numImages: diagnosticImages ? Object.keys(diagnosticImages).length : 0
    });

    // Save to DB with all diagnostic data
    const patient = new Patient({
      patientName: patientName.trim(),
      age: parseInt(age),
      details: details || '',
      imagePath,
      prediction: prediction || 'PENDING',
      confidence: confidence || accuracy || 0,
      accuracy: accuracy || 0,
      precision: precision || 0,
      f1Score: f1Score || 0,
      pneumoniaStage: pneumoniaStage || 'Healthy Lung',
      severity: severity || 'Healthy',
      diagnosticImages: diagnosticImages || {
        preprocessing: null,
        segmentation: null,
        edgeDetection: null,
        gradcam: null
      }
    });

    console.log(`[Patient Save] Patient object created, saving to DB...`);
    let savedPatient;
    try {
      savedPatient = await patient.save();
      console.log(`[Patient Save] ✓ Patient saved with ID: ${savedPatient._id}`);
      console.log(`[Patient Save] Document in DB with fields:`, Object.keys(savedPatient.toObject()));
    } catch (saveError) {
      console.error(`[Patient Save] ✗ Save failed:`, saveError.message);
      console.error(`[Patient Save] Error details:`, saveError);
      throw saveError;
    }
    console.log(`[Patient Save] Final - returning saved patient:`, savedPatient._id);

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