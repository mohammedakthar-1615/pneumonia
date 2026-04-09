const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();

const patientRoutes = require('./routes/patientRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pneumonia_db').then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Routes
app.use('/api', patientRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running...");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: 'Server is running on port ' + PORT });
});

// Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see the server response.`);
});

// Increase timeout for long-running requests (image processing)
server.setTimeout(600000); // 10 minutes