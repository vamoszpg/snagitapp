import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaFileAlt, FaMoon, FaSun, FaSignOutAlt } from 'react-icons/fa';
import './Header.css';

const Header = ({ 
  isDarkMode, 
  toggleDarkMode,
  onLogout
}) => {
  const location = useLocation();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      onLogout();
    }
  };

  return (
    <header className={`App-header ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="header-content">
        <div className="logo">Snag It</div>
        <nav className="header-nav">
          <Link 
            to="/" 
            className={`nav-button ${location.pathname === '/' ? 'active' : ''}`}
          >
            <FaHome /> Dashboard
          </Link>
          <Link 
            to="/reports" 
            className={`nav-button ${location.pathname === '/reports' ? 'active' : ''}`}
          >
            <FaFileAlt /> Reports
          </Link>
        </nav>
      </div>
      <div className="header-actions">
        <button onClick={toggleDarkMode} className="icon-button" title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
          {isDarkMode ? <FaSun /> : <FaMoon />}
        </button>
        <button onClick={handleLogout} className="icon-button" title="Logout">
          <FaSignOutAlt />
        </button>
      </div>
    </header>
  );
};

export default Header;
