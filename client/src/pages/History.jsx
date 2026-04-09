import React, { useState, useEffect } from 'react';
import { getAllPatients } from '../services/api';
import './styles/History.css';

const History = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPrediction, setFilterPrediction] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await getAllPatients(1, 100);
      setPatients(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to load patient history');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients
    .filter(patient => {
      const matchesSearch = patient.patientName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrediction = filterPrediction === 'all' || 
        patient.prediction.toLowerCase() === filterPrediction.toLowerCase();
      return matchesSearch && matchesPrediction;
    })
    .sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'name') {
        return a.patientName.localeCompare(b.patientName);
      }
      return 0;
    });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusClass = (prediction) => {
    return prediction.toLowerCase() === 'pneumonia' ? 'status-danger' : 'status-safe';
  };

  const getStatusIcon = (prediction) => {
    return prediction.toLowerCase() === 'pneumonia' ? '⚠️' : '✅';
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <div className="header-content">
          <h1>Patient Analysis History</h1>
          <p>View and manage all analyzed X-ray records</p>
        </div>
      </div>

      <div className="history-container">
        {/* Filters Section */}
        <div className="filters-section">
          <div className="filter-group">
            <label>Search by Patient Name</label>
            <input
              type="text"
              placeholder="Enter patient name..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Filter by Result</label>
            <select
              className="filter-select"
              value={filterPrediction}
              onChange={(e) => setFilterPrediction(e.target.value)}
            >
              <option value="all">All Results</option>
              <option value="normal">Normal</option>
              <option value="pneumonia">Pneumonia</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort by</label>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Patient Name</option>
            </select>
          </div>

          <button className="refresh-btn" onClick={fetchPatients}>
            🔄 Refresh
          </button>
        </div>

        {/* Results Summary */}
        <div className="results-summary">
          <div className="summary-stat">
            <span className="stat-label">Total Records</span>
            <span className="stat-value">{filteredPatients.length}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Normal Cases</span>
            <span className="stat-value safe">
              {filteredPatients.filter(p => p.prediction.toLowerCase() === 'normal').length}
            </span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Pneumonia Cases</span>
            <span className="stat-value danger">
              {filteredPatients.filter(p => p.prediction.toLowerCase() === 'pneumonia').length}
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading patient records...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="error-state">
            <p>❌ {error}</p>
            <button onClick={fetchPatients} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredPatients.length === 0 && (
          <div className="empty-state">
            <p>📋 No patient records found</p>
            <p className="empty-subtext">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Table View - Desktop */}
        {!loading && !error && filteredPatients.length > 0 && (
          <div className="table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Age</th>
                  <th>Result</th>
                  <th>Confidence</th>
                  <th>Date & Time</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient, index) => (
                  <tr key={patient._id || index} className="table-row">
                    <td className="patient-name">{patient.patientName}</td>
                    <td className="patient-age">{patient.age} yrs</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(patient.prediction)}`}>
                        {getStatusIcon(patient.prediction)} {patient.prediction}
                      </span>
                    </td>
                    <td className="confidence">
                      <div className="confidence-bar">
                        <div
                          className="confidence-fill"
                          style={{
                            width: `${Math.min(patient.accuracy || 0, 100)}%`,
                            backgroundColor: getStatusClass(patient.prediction) === 'status-danger'
                              ? '#fb7185'
                              : '#14b8a6'
                          }}
                        ></div>
                      </div>
                      <span>{Math.round(patient.accuracy || 0)}%</span>
                    </td>
                    <td className="date-time">{formatDate(patient.createdAt)}</td>
                    <td className="patient-details">{patient.details || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Card View - Mobile */}
        {!loading && !error && filteredPatients.length > 0 && (
          <div className="cards-container">
            {filteredPatients.map((patient, index) => (
              <div key={patient._id || index} className="patient-card">
                <div className="card-header">
                  <div className="card-title-section">
                    <h3>{patient.patientName}</h3>
                    <span className={`status-badge ${getStatusClass(patient.prediction)}`}>
                      {getStatusIcon(patient.prediction)} {patient.prediction}
                    </span>
                  </div>
                  <p className="card-date">{formatDate(patient.createdAt)}</p>
                </div>

                <div className="card-content">
                  <div className="info-row">
                    <span className="info-label">Age:</span>
                    <span className="info-value">{patient.age} years</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Confidence:</span>
                    <div className="confidence-bar-mobile">
                      <div
                        className="confidence-fill"
                        style={{
                          width: `${Math.min(patient.accuracy || 0, 100)}%`,
                          backgroundColor: getStatusClass(patient.prediction) === 'status-danger'
                            ? '#fb7185'
                            : '#14b8a6'
                        }}
                      ></div>
                    </div>
                    <span className="info-value">{Math.round(patient.accuracy || 0)}%</span>
                  </div>
                  {patient.details && (
                    <div className="info-row">
                      <span className="info-label">Notes:</span>
                      <span className="info-value">{patient.details}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
