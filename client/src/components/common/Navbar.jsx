import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="top-nav">
      <div className="brand-shell">
        <div className="brand-chip">🏥</div>
        <div className="brand-text">Pneumonia AI Detector</div>
      </div>

      <div className="nav-links">
        <Link 
          to="/" 
          className={`nav-link ${isActive('/') ? 'active' : ''}`}
          title="Home - Welcome and overview"
        >
          🏠 Home
        </Link>
        <Link 
          to="/predict" 
          className={`nav-link ${isActive('/predict') ? 'active' : ''}`}
          title="Analyze - Upload and predict X-rays"
        >
          🔬 Analyze
        </Link>
        <Link 
          to="/dashboard" 
          className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
          title="Dashboard - View patient history and reports"
        >
          📊 Dashboard
        </Link>
        <Link 
          to="/about" 
          className={`nav-link ${isActive('/about') ? 'active' : ''}`}
          title="About - Learn how pneumonia works and follow recovery guidance"
        >
          🧠 About
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;