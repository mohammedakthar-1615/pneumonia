const express = require('express');
const multer = require('multer');
const patientController = require('../controllers/patientController');

const router = express.Router();

// Multer setup for file uploads with validation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG and PNG images are allowed'));
    }
  },
  limits: { fileSize: 20 * 1024 * 1024 } // 20MB
});

// Routes
router.post('/upload', upload.single('image'), patientController.uploadImage);
router.get('/patients', patientController.getAllPatients);
router.get('/patient/:name', patientController.getPatientHistory);
router.get('/patient-by-id/:id', patientController.getPatientById);
router.put('/patient/:id', patientController.updatePatientReport);

module.exports = router;