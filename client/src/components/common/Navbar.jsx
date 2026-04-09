import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand">
          <div className="brand-chip">💊</div>
          <span className="brand-text">PneumoAI</span>
        </Link>

        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/predict" className={isActive('/predict') ? 'active' : ''}>
              Predict
            </Link>
          </li>
          <li>
            <Link to="/history" className={isActive('/history') ? 'active' : ''}>
              History
            </Link>
          </li>
          <li>
            <Link to="/about" className={isActive('/about') ? 'active' : ''}>
              About
            </Link>
          </li>
          <li>
            <Link to="/precautions" className={isActive('/precautions') ? 'active' : ''}>
              Precautions
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;