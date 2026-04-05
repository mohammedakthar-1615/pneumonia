import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPatientHistory } from '../services/api';
import GraphView from '../components/GraphView';
import ResultCard from '../components/Resultcard';

const newsItems = [
  {
    title: 'Global pneumonia research advances',
    text: 'New imaging research highlights how AI can identify early-stage lung infections faster than standard radiology review.'
  },
  {
    title: 'Remote recovery monitoring',
    text: 'Track patients over time with repeated scans and capture recovery trends using confidence and F1-score metrics.'
  },
  {
    title: 'Precision-driven diagnostics',
    text: 'Built-in performance metrics help clinicians evaluate each prediction and support reliable treatment decisions.'
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState('');
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('Search patient history or start a new prediction.');

  const handleSearch = async () => {
    if (!patientName.trim()) {
      setStatus('Please enter a patient name to search.');
      return;
    }

    try {
      const response = await getPatientHistory(patientName.trim());
      const records = response.data;
      setHistory(records);
      setStatus(records.length > 0
        ? `Found ${records.length} match(es) for ${patientName}.`
        : 'No records found. Use New patient prediction to add a fresh scan.');
    } catch (error) {
      console.error(error);
      setStatus('Unable to fetch patient history. Try again later.');
    }
  };

  return (
    <main className="page dashboard-page">
      <section className="card">
        <h2 className="section-title">Patient Intelligence Dashboard</h2>
        <p className="section-description">
          Search existing patient records, review pneumonia progress, and launch a fresh scan for new users.
          Each result is stored with prediction metrics so you can monitor recovery across multiple visits.
        </p>

        <div className="info-panel" style={{ marginBottom: '24px' }}>
          <h3 className="section-title">Why tracking matters</h3>
          <p className="section-description">
            Longitudinal imaging history supports better decisions for treatment, discharge planning, and follow-up care. Use this dashboard to compare scans, validate improvements, and identify when additional imaging is needed.
          </p>
        </div>

        <div className="dashboard-grid">
          <div className="card" style={{ padding: '24px' }}>
            <h3 className="section-title">Patient search</h3>
            <input
              className="input-field"
              type="text"
              placeholder="Enter patient name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '20px' }}>
              <button className="glow-btn" type="button" onClick={handleSearch}>
                Search history
              </button>
              <button className="ghost-btn" type="button" onClick={() => navigate('/predict')}>
                New patient prediction
              </button>
            </div>
            <p className="status-copy">{status}</p>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 className="section-title">Prediction insight</h3>
            <p className="section-description">
              These reports help identify pneumonia progression, improve follow-up plans, and support treatment decisions with clear accuracy metrics.
            </p>
            <div className="metric-grid">
              <div className="metric-box">
                <div className="metric-label">Recovery tracking</div>
                <div className="metric-value">Scan history for every patient</div>
              </div>
              <div className="metric-box">
                <div className="metric-label">Smart workflow</div>
                <div className="metric-value">New users start here</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="news-grid">
        {newsItems.map((item, index) => (
          <article key={index} className="news-card">
            <h4 className="news-card-title">{item.title}</h4>
            <p className="news-card-text">{item.text}</p>
          </article>
        ))}
      </section>

      {history.length > 0 && (
        <section className="card">
          <h3 className="section-title">History timeline</h3>
          <GraphView data={history} />
          <div style={{ marginTop: '24px', display: 'grid', gap: '20px' }}>
            {history.map((record, index) => (
              <ResultCard key={index} result={record} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
};

export default Dashboard;
