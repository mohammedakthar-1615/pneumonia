import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with timeout
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,  // Increased to 2 minutes for other requests (was 30s)
  headers: {
    'Content-Type': 'application/json'
  }
});

// Error handler with detailed messaging
const handleError = (error) => {
  const errorResponse = {
    status: error.response?.status,
    message: error.response?.data?.error || error.message,
    details: error.response?.data?.details,
    isNetworkError: !error.response,
    isTimeout: error.code === 'ECONNABORTED'
  };

  if (errorResponse.isNetworkError) {
    errorResponse.message = 'Network error - server may be offline';
  } else if (errorResponse.isTimeout) {
    errorResponse.message = 'Request timeout - server taking too long to respond';
  }

  throw errorResponse;
};

// Upload image with FormData
export const uploadImage = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      timeout: 300000  // Increased to 5 minutes to account for ML processing time (was 30s)
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get patient history by name
export const getPatientHistory = async (name) => {
  try {
    const response = await apiClient.get(`/patient/${encodeURIComponent(name)}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get all patients with pagination
export const getAllPatients = async (page = 1, limit = 10) => {
  try {
    const response = await apiClient.get(`/patients?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Get single patient by ID
export const getPatientById = async (id) => {
  try {
    const response = await apiClient.get(`/patient-by-id/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Update patient report
export const updatePatientReport = async (id, data) => {
  try {
    const response = await apiClient.put(`/patient/${id}`, data);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};